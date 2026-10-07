import { Reveal } from '@/components/shared/Reveal'

export function SectionHeading({
  index,
  label,
  title,
  aside,
}: {
  index: string
  label: string
  title: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <Reveal as="header" className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12">
      <p className="eyebrow md:col-span-3">
        <span className="text-signal">{index}</span> / {label}
      </p>
      <h2 className="font-display text-5xl leading-[0.95] tracking-[-0.02em] text-paper md:col-span-6 md:text-7xl">
        {title}
      </h2>
      {aside && (
        <div className="self-end text-sm leading-relaxed text-paper/50 md:col-span-3">{aside}</div>
      )}
    </Reveal>
  )
}
