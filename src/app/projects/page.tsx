import { projects, publications } from '@/lib/data'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { SectionHeader } from '@/components/projects/SectionHeader'
import { PaperCutout } from '@/components/projects/PaperCutout'
import { FavoriteToolCallout } from '@/components/projects/FavoriteToolCallout'
import { PageTransition } from '@/components/shared/PageTransition'

export const metadata = {
  title: 'Projects',
  description: 'Research, publications, and things built by Joseph Ayinde.',
}

export default function ProjectsPage() {
  const built = projects.filter((p) => p.category === 'built')

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <section className="mb-24">
          <SectionHeader
            title="Publications"
            description="research at the intersection of neuroscience, AI, and learning"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {publications.map((pub, i) => (
              <PaperCutout key={pub.id} publication={pub} index={i} />
            ))}
          </div>
        </section>

        <section className="mb-24">
          <SectionHeader
            title="Built"
            description="things brought from idea to reality"
          />
          <ProjectGrid projects={built} />
        </section>

        <div className="flex justify-center">
          <div className="max-w-sm">
            <FavoriteToolCallout />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
