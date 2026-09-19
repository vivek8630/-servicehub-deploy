'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  MapPin,
  Sparkles,
  Star,
  Users,
  Shield,
  Wrench,
  Zap,
  Sparkle,
  Tv,
  Paintbrush,
  Scissors,
  Car,
  GraduationCap,
  Grid,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const quickCategories = [
  { name: 'Electrician & Plumbing', slug: 'home-services', icon: Wrench, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { name: 'Appliance & TV Repair', slug: 'technology', icon: Tv, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { name: 'Home Deep Cleaning', slug: 'cleaning', icon: Sparkle, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { name: 'Painting & Waterproofing', slug: 'home-services', icon: Paintbrush, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { name: 'Salon & Beauty at Home', slug: 'personal-services', icon: Scissors, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { name: 'Automotive & Wash', slug: 'automotive', icon: Car, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { name: 'Tutors & Education', slug: 'education', icon: GraduationCap, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
]

const stats = [
  { value: '10,000+', label: 'Verified Experts', icon: Shield },
  { value: '50,000+', label: 'Jobs Completed', icon: Users },
  { value: '4.9★', label: 'Average Rating', icon: Star },
]

export default function HeroSection() {
  const router = useRouter()
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          )
          if (res.ok) {
            const data = await res.json()
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              ''
            setLocation(city)
          } else {
            setLocation('Bangalore')
          }
        } catch {
          setLocation('Bangalore')
        } finally {
          setDetecting(false)
        }
      },
      () => {
        setDetecting(false)
        setLocation('Bangalore')
      }
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (service) params.set('search', service)
    if (location) params.set('city', location)
    router.push(`/providers?${params.toString()}`)
  }

  const handleCategorySelect = (categorySlug: string) => {
    const params = new URLSearchParams({ category: categorySlug })
    if (location) params.set('city', location)
    router.push(`/providers?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center hero-gradient pt-16 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-60 -left-40 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      {/* MOVABLE FLOATING PICTURE CARDS IN BLANK SPACES */}
      {/* Left Movable Image Card 1 */}
      <div className="hidden xl:block absolute top-28 left-6 z-10 animate-float">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-white/80 max-w-[260px] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="relative h-44 w-full rounded-xl overflow-hidden mb-2">
            <img
              src="/images/repair-moment.png"
              alt="Electrician at work"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
              <Star className="w-3 h-3 fill-slate-950" /> 4.9 Rating
            </span>
          </div>
          <div className="px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Certified Electrician</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Arrived in 15 mins ✓</p>
          </div>
        </div>
      </div>

      {/* Left Movable Image Card 2 (Lower) */}
      <div className="hidden xl:block absolute bottom-24 left-10 z-10 animate-float" style={{ animationDelay: '1.2s' }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Emergency 24/7</p>
            <p className="text-[11px] text-slate-500">Fast local response</p>
          </div>
        </div>
      </div>

      {/* Right Movable Image Card 1 */}
      <div className="hidden xl:block absolute top-28 right-6 z-10 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-white/80 max-w-[260px] transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="relative h-44 w-full rounded-xl overflow-hidden mb-2">
            <img
              src="/images/cleaning-moment.png"
              alt="Home Cleaning Specialist"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
              <CheckCircle2 className="w-3 h-3" /> Eco-Clean
            </span>
          </div>
          <div className="px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkle className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500" />
              <span>Luxury Deep Cleaning</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Spotless & Disinfected</p>
          </div>
        </div>
      </div>

      {/* Right Movable Image Card 2 (Lower) */}
      <div className="hidden xl:block absolute bottom-24 right-10 z-10 animate-float" style={{ animationDelay: '0.8s' }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-white/80 max-w-[240px]">
          <div className="relative h-32 w-full rounded-xl overflow-hidden mb-1.5">
            <img
              src="/images/hero-banner.png"
              alt="Verified Professionals"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[11px] font-bold text-slate-900 text-center">10,000+ Verified Experts</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-2 text-sm font-medium mb-6 border border-violet-200 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Book Verified Local Service Professionals
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            What Service Do You Need Today?
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Choose a service category below or search your location to get matched with top-rated local experts.
          </p>

          {/* Main Search Bar */}
          <form
            onSubmit={handleSearch}
            className="glass rounded-2xl p-3 shadow-xl max-w-3xl mx-auto mb-8 border border-white/60"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative border-b border-slate-200 sm:border-b-0 sm:border-r border-slate-200">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="hero-search-service"
                  type="text"
                  placeholder="Search service (e.g. Electrician, Plumbing, Cleaning)"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                />
              </div>
              <div className="flex-1 relative flex items-center pr-3 mb-2 sm:mb-0">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="hero-search-location"
                  type="text"
                  placeholder="Your City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-24 py-3 bg-transparent rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg shrink-0 disabled:opacity-50"
                >
                  {detecting ? 'Detecting...' : 'Detect'}
                </button>
              </div>
              <Button type="submit" variant="gradient" size="lg" className="shrink-0">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </form>

          {/* Interactive Quick Category Selector Cards */}
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-3xl mx-auto mb-3 px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select a Category</span>
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                View All Categories <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {quickCategories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-violet-300 hover:shadow-md transition-all text-left flex items-center gap-3 group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cat.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-xs text-slate-800 group-hover:text-violet-700 leading-tight">
                      {cat.name}
                    </span>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="p-3.5 rounded-2xl bg-violet-600 text-white hover:bg-violet-700 shadow-md transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Grid className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs leading-tight">
                  Browse All Categories
                </span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center border border-white/60">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-violet-600" />
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Category Modal Chooser */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Choose Service Category</h3>
                <p className="text-xs text-slate-500">Select what you need to filter top rated local providers</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {quickCategories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setShowCategoryModal(false)
                      handleCategorySelect(cat.slug)
                    }}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-violet-500 hover:bg-violet-50/40 transition-all text-left flex flex-col items-center text-center gap-2"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xs text-slate-800">{cat.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 text-right">
              <Button variant="outline" onClick={() => setShowCategoryModal(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
