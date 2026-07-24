'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Project } from '@/lib/types'
import { TiltCard } from '@/components/shared/TiltCard'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={project.featured ? 'md:col-span-2' : ''}
    >
      <TiltCard className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]">
        {project.image && (
          <div
            className={`relative mb-5 h-48 w-full overflow-hidden rounded-xl ${
              project.id === 'lamlab' ? 'bg-black/60' : 'bg-white/5'
            }`}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={
                project.id === 'lamlab'
                  ? 'object-contain p-10 transition-transform duration-500 group-hover:scale-105'
                  : 'object-cover transition-transform duration-500 group-hover:scale-105'
              }
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <h3 className="mb-2 text-lg font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
          {project.link ? (
            <a
              href={project.link}
              target={project.external ? '_blank' : undefined}
              rel={project.external ? 'noopener noreferrer' : undefined}
              className="underline-offset-4 hover:underline"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-white/50 group-hover:text-white/65">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-white/45"
            >
              {tag}
            </span>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}
