import Link from 'next/link'
import {
  Wrench,
  Monitor,
  GraduationCap,
  Car,
  SprayCanIcon,
  Camera,
  Palette,
  Scissors,
  ChevronRight,
} from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
}

const defaultCategories = [
  { name: 'Home Repair', slug: 'home-services', icon: 'Wrench', color: '#7c3aed', description: 'Electricians, plumbers, carpenters' },
  { name: 'Technology', slug: 'technology', icon: 'Monitor', color: '#2563eb', description: 'Laptop & phone repair, IT support' },
  { name: 'Education', slug: 'education', icon: 'GraduationCap', color: '#059669', description: 'Tutors for all subjects' },
  { name: 'Automotive', slug: 'automotive', icon: 'Car', color: '#d97706', description: 'Car & bike mechanics, wash' },
  { name: 'Cleaning', slug: 'cleaning', icon: 'SprayCanIcon', color: '#0891b2', description: 'Home & office cleaning' },
  { name: 'Photography', slug: 'creative', icon: 'Camera', color: '#db2777', description: 'Events, portraits, video' },
  { name: 'Design', slug: 'creative', icon: 'Palette', color: '#7c3aed', description: 'Graphic & web designers' },
  { name: 'Beauty', slug: 'personal-services', icon: 'Scissors', color: '#9333ea', description: 'Salon, makeup, wellness' },
]

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Monitor,
  GraduationCap,
  Car,
  SprayCanIcon,
  Camera,
  Palette,
  Scissors,
}

interface CategoriesSectionProps {
  categories: Category[]
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle mx-auto">
            Find the right professional for any job — from quick fixes to complete projects.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayCategories.map((cat, idx) => {
            const categoryData = defaultCategories[idx % defaultCategories.length]
            const IconComponent = iconMap[cat.icon || categoryData.icon] || Wrench
            const color = cat.color || categoryData.color

            return (
              <Link
                key={'id' in cat ? cat.id : cat.slug}
                href={`/providers?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: color }}
                />

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <IconComponent className="w-6 h-6" style={{ color }} />
                </div>

                <h3 className="font-semibold text-slate-900 mb-1 text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {cat.description || categoryData.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color }}>
                  Explore
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 transition-colors"
          >
            View all service categories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
