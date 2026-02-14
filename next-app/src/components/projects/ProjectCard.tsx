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
      <TiltCard className="relative group block p-6 rounded-xl border border-neutral-200 bg-white/60 backdrop-blur-sm hover:border-neutral-300 hover:bg-white/80 transition-colors duration-300 overflow-hidden shadow-sm hover:shadow-md">
        {project.image && (
          <div className="relative w-full h-48 mb-5 rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <h3 className="text-lg font-medium text-neutral-800 mb-2 group-hover:text-neutral-900 transition-colors duration-300">
          {project.link ? (
            <a
              href={project.link}
              target={project.external ? '_blank' : undefined}
              rel={project.external ? 'noopener noreferrer' : undefined}
              className="hover:underline underline-offset-4"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="text-sm text-neutral-500 leading-relaxed mb-4 group-hover:text-neutral-600">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-mono text-neutral-500 bg-neutral-100 rounded-md border border-neutral-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}
