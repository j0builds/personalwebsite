/**
 * Match sound, synthesised with Web Audio so there are no files to load. An AudioContext can only
 * start from a user gesture, so nothing plays until the visitor first picks a side.
 */

export const SOUND_KEY = 'j0-sound'

export function soundPreferred() {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSoundPreferred(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {}
}

export class MatchSound {
  private ac: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private clap: AudioBuffer | null = null
  private bed: GainNode | null = null
  private on = soundPreferred()

  get enabled() {
    return this.on
  }

  /** Call from inside a user gesture. */
  wake() {
    if (!this.on) return
    if (!this.ac) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      this.ac = new Ctor()
      this.master = this.ac.createGain()
      this.master.gain.value = 0.9
      const comp = this.ac.createDynamicsCompressor()
      comp.threshold.value = -14
      comp.ratio.value = 4
      this.master.connect(comp).connect(this.ac.destination)
      this.noise = this.makeNoise(2)
      this.clap = this.makeApplause(3.2)
      this.startBed()
    }
    if (this.ac.state === 'suspended') void this.ac.resume()
  }

  setEnabled(on: boolean) {
    this.on = on
    setSoundPreferred(on)
    if (!this.ac || !this.master) return
    const t = this.ac.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(on ? 0.9 : 0, t, 0.08)
  }

  /** Lets the crowd die away as the visitor walks through. */
  fadeOut(seconds = 1.2) {
    if (!this.ac || !this.master) return
    const t = this.ac.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(0, t, seconds / 4)
    const ac = this.ac
    window.setTimeout(() => void ac.close(), seconds * 1000 + 400)
    this.ac = null
  }

  destroy() {
    if (this.ac) void this.ac.close()
    this.ac = null
  }

  private ready() {
    return this.on && this.ac && this.master && this.noise && this.ac.state !== 'closed' ? this.ac : null
  }

  private makeNoise(seconds: number) {
    const ac = this.ac!
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  /** Thousands of single claps, each a tiny decaying burst, scattered in time. */
  private makeApplause(seconds: number) {
    const ac = this.ac!
    const sr = ac.sampleRate
    const buf = ac.createBuffer(2, Math.floor(sr * seconds), sr)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      const claps = Math.floor(seconds * 520)
      for (let k = 0; k < claps; k++) {
        const at = Math.floor(Math.random() * (d.length - sr * 0.02))
        const env = Math.max(0, 1 - at / d.length) ** 0.6
        const amp = (0.25 + Math.random() * 0.75) * env
        const len = Math.floor(sr * (0.004 + Math.random() * 0.008))
        for (let i = 0; i < len; i++) d[at + i] += (Math.random() * 2 - 1) * amp * Math.exp((-i / len) * 5)
      }
      for (let i = 0; i < d.length; i++) d[i] *= 0.35
    }
    return buf
  }

  private src(buffer: AudioBuffer, loop = false) {
    const s = this.ac!.createBufferSource()
    s.buffer = buffer
    s.loop = loop
    return s
  }

  private env(g: GainNode, at: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(peak, at + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay)
  }

  private startBed() {
    const ac = this.ac!
    const s = this.src(this.noise!, true)
    const lp = ac.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    const bp = ac.createBiquadFilter()
    bp.type = 'peaking'
    bp.frequency.value = 650
    bp.gain.value = 6
    this.bed = ac.createGain()
    this.bed.gain.value = 0
    this.bed.gain.setTargetAtTime(0.11, ac.currentTime, 0.6)
    // a slow swell, like a stadium breathing
    const lfo = ac.createOscillator()
    lfo.frequency.value = 0.13
    const depth = ac.createGain()
    depth.gain.value = 0.025
    lfo.connect(depth).connect(this.bed.gain)
    s.connect(lp).connect(bp).connect(this.bed).connect(this.master!)
    s.start()
    lfo.start()
  }

  /** The crowd goes quiet as the striker steps up. */
  hush(level = 0.05) {
    const ac = this.ready()
    if (!ac || !this.bed) return
    this.bed.gain.setTargetAtTime(level, ac.currentTime, 0.35)
  }

  whistle() {
    const ac = this.ready()
    if (!ac) return
    const t = ac.currentTime + 0.01
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.02)
    g.gain.setValueAtTime(0.07, t + 0.3)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42)
    // the pea inside the whistle chops the tone into a fast flutter
    const flutter = ac.createGain()
    flutter.gain.value = 0.55
    const pea = ac.createOscillator()
    pea.frequency.value = 34
    const peaDepth = ac.createGain()
    peaDepth.gain.value = 0.45
    pea.connect(peaDepth).connect(flutter.gain)
    for (const f of [2860, 3010]) {
      const o = ac.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(flutter)
      o.start(t)
      o.stop(t + 0.45)
    }
    flutter.connect(g).connect(this.master!)
    pea.start(t)
    pea.stop(t + 0.45)
  }

  kick() {
    const ac = this.ready()
    if (!ac) return
    const t = ac.currentTime
    const o = ac.createOscillator()
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(48, t + 0.11)
    const g = ac.createGain()
    this.env(g, t, 0.75, 0.004, 0.16)
    o.connect(g).connect(this.master!)
    o.start(t)
    o.stop(t + 0.2)
    // leather slap on top
    const n = this.src(this.noise!)
    const hp = ac.createBiquadFilter()
    hp.type = 'bandpass'
    hp.frequency.value = 1700
    hp.Q.value = 0.9
    const ng = ac.createGain()
    this.env(ng, t, 0.35, 0.002, 0.05)
    n.connect(hp).connect(ng).connect(this.master!)
    n.start(t, Math.random())
    n.stop(t + 0.08)
  }

  whoosh(duration: number) {
    const ac = this.ready()
    if (!ac) return
    const t = ac.currentTime
    const n = this.src(this.noise!)
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.4
    bp.frequency.setValueAtTime(380, t)
    bp.frequency.exponentialRampToValueAtTime(1400, t + duration)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.08, t + duration * 0.85)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration + 0.06)
    n.connect(bp).connect(g).connect(this.master!)
    n.start(t, Math.random())
    n.stop(t + duration + 0.1)
  }

  glove(caught: boolean) {
    const ac = this.ready()
    if (!ac) return
    const t = ac.currentTime
    const n = this.src(this.noise!)
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = caught ? 900 : 1400
    bp.Q.value = 1.1
    const g = ac.createGain()
    this.env(g, t, caught ? 0.55 : 0.7, 0.002, caught ? 0.12 : 0.08)
    n.connect(bp).connect(g).connect(this.master!)
    n.start(t, Math.random())
    n.stop(t + 0.2)
    const o = ac.createOscillator()
    o.frequency.setValueAtTime(caught ? 140 : 210, t)
    o.frequency.exponentialRampToValueAtTime(60, t + 0.09)
    const og = ac.createGain()
    this.env(og, t, 0.45, 0.003, 0.1)
    o.connect(og).connect(this.master!)
    o.start(t)
    o.stop(t + 0.15)
  }

  net() {
    const ac = this.ready()
    if (!ac) return
    const t = ac.currentTime
    const n = this.src(this.noise!)
    const hp = ac.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 2400
    const g = ac.createGain()
    this.env(g, t, 0.16, 0.012, 0.42)
    n.connect(hp).connect(g).connect(this.master!)
    n.start(t, Math.random())
    n.stop(t + 0.5)
  }

  /** The crowd rising together: a broad roar for a goal, an "ohh" and applause for a save. */
  crowd(kind: 'roar' | 'save') {
    const ac = this.ready()
    if (!ac) return
    const t = ac.currentTime
    const n = this.src(this.noise!, true)
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = kind === 'roar' ? 0.6 : 2.2
    if (kind === 'save') {
      // a vowel that opens and settles: "ohh"
      bp.frequency.setValueAtTime(420, t)
      bp.frequency.linearRampToValueAtTime(760, t + 0.35)
      bp.frequency.linearRampToValueAtTime(560, t + 1.4)
    } else {
      bp.frequency.value = 820
    }
    const g = ac.createGain()
    const peak = kind === 'roar' ? 0.32 : 0.3
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + (kind === 'roar' ? 0.25 : 0.18))
    g.gain.setTargetAtTime(peak * 0.55, t + 0.6, 0.5)
    g.gain.setTargetAtTime(0.0001, t + 1.8, 0.6)
    n.connect(bp).connect(g).connect(this.master!)
    n.start(t, Math.random())
    n.stop(t + 4.5)

    const a = this.src(this.clap!)
    const ag = ac.createGain()
    ag.gain.value = kind === 'save' ? 0.55 : 0.3
    const hp = ac.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 900
    a.connect(hp).connect(ag).connect(this.master!)
    a.start(t + (kind === 'save' ? 0.25 : 0.4))
    this.bed?.gain.setTargetAtTime(0.11, t + 1.5, 0.8)
  }
}
