import Image from 'next/image'

type LamLogoProps = {
  variant?: 'mark' | 'lockup'
  tone?: 'dark' | 'light'
  className?: string
  markClassName?: string
  priority?: boolean
}

export function LamLogo({
  variant = 'mark',
  tone = 'dark',
  className = '',
  markClassName = 'h-9 w-9',
  priority = false,
}: LamLogoProps) {
  // Official mark is white artwork on black — invert for light UI
  const mark = (
    <Image
      src="/assets/brand/lam.png"
      alt={variant === 'mark' ? 'The Learning and Memory Lab' : ''}
      width={180}
      height={182}
      priority={priority}
      aria-hidden={variant !== 'mark'}
      className={`${markClassName} ${tone === 'dark' ? 'brightness-0' : ''}`.trim()}
    />
  )

  if (variant === 'mark') {
    return <span className={className}>{mark}</span>
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {mark}
      <span
        className={`text-left leading-[1.15] font-medium tracking-tight ${
          tone === 'light' ? 'text-white' : 'text-neutral-900'
        }`}
      >
        <span className="block text-sm md:text-[15px]">The Learning</span>
        <span className="block text-sm md:text-[15px]">and Memory Lab</span>
      </span>
    </span>
  )
}
