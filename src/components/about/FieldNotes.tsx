import Image from 'next/image'
import { Reveal } from '@/components/shared/Reveal'

const notes = [
  {
    src: '/assets/images/neurosurgery.jpg',
    alt: 'Joseph in scrubs in the operating room at Macquarie University Hospital',
    caption: 'Computational Neurosurgery Lab — Sydney',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/assets/images/cmu.jpg',
    alt: 'Selfie of Joseph wearing headphones outdoors',
    caption: 'Pittsburgh — Carnegie Mellon',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/assets/images/launch.jpg',
    alt: 'Joseph sitting beside an Innovate Carolina sign at UNC',
    caption: 'Innovate Carolina — UNC',
    aspect: 'aspect-[4/3]',
    position: 'object-[70%_50%]',
  },
  {
    src: '/assets/images/soccer.jpg',
    alt: 'Joseph diving for a save as a goalkeeper',
    caption: 'Between the posts',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/assets/images/chancellor.jpg',
    alt: 'Joseph on stage receiving an award plaque',
    caption: 'On stage',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/assets/images/saywordfc.jpg',
    alt: 'Joseph with his soccer team on matchday',
    caption: 'Matchday',
    aspect: 'aspect-[3/4]',
  },
]

export function FieldNotes() {
  return (
    <section aria-label="Field notes" className="py-10 md:py-16">
      <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between px-6 md:px-12">
        <p className="eyebrow">Field notes</p>
        <p className="eyebrow hidden md:block">Scroll →</p>
      </div>
      <ul
        className="flex snap-x snap-mandatory scroll-px-6 items-end gap-4 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:scroll-px-12 md:gap-6 md:px-12 [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent
      >
        {notes.map((n, i) => (
          <Reveal
            as="li"
            key={n.src}
            delay={i * 0.06}
            className="w-[72vw] shrink-0 snap-start sm:w-[42vw] md:w-[26vw] lg:w-[22vw]"
          >
            <figure className="group">
              <div className={`relative overflow-hidden rounded-2xl border hairline ${n.aspect}`}>
                <Image
                  src={n.src}
                  alt={n.alt}
                  fill
                  sizes="(max-width: 768px) 72vw, 24vw"
                  className={`object-cover grayscale-[0.4] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 ${n.position ?? ''}`}
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-3 text-xs text-paper/50">
                <span className="font-mono text-paper/30">{String(i + 1).padStart(2, '0')}</span>
                {n.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
