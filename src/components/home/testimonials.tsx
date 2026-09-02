import { Star, Quote } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const testimonials = [
  {
    name: 'Ananya Krishnamurthy',
    role: 'Customer, Bangalore',
    rating: 5,
    text: 'Found an amazing laptop repair technician within minutes. He came the same day and fixed my screen for a very reasonable price. The whole process was seamless!',
    service: 'Laptop Screen Repair',
    initials: 'AK',
  },
  {
    name: 'Rajesh Gupta',
    role: 'Customer, Delhi',
    rating: 5,
    text: 'I have used ServiceHub 3 times now for different services. The providers are professional, punctual, and the quality of work is always top-notch. Highly recommend!',
    service: 'Home Electrical Work',
    initials: 'RG',
  },
  {
    name: 'Meena Subramaniam',
    role: 'Customer, Chennai',
    rating: 5,
    text: 'My daughter needed a math tutor urgently before her board exams. ServiceHub connected us with an excellent tutor in our city. She scored 95% and we are thrilled!',
    service: 'Mathematics Tutoring',
    initials: 'MS',
  },
  {
    name: 'Amit Joshi',
    role: 'Provider, Mumbai',
    rating: 5,
    text: 'As a freelance photographer, ServiceHub has transformed my business. I get consistent bookings every week and the platform handles everything professionally.',
    service: 'Photography Provider',
    initials: 'AJ',
  },
  {
    name: 'Deepika Reddy',
    role: 'Customer, Hyderabad',
    rating: 4,
    text: 'Booked a home cleaning service for a party. The team arrived on time, was very professional, and the house looked spotless. Will definitely book again!',
    service: 'Deep Home Cleaning',
    initials: 'DR',
  },
  {
    name: 'Sanjay Kumar',
    role: 'Customer, Pune',
    rating: 5,
    text: 'Finally a platform that actually works! The provider verification gives me peace of mind. My plumber fixed a complex pipe issue that others had given up on.',
    service: 'Plumbing Services',
    initials: 'SK',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle mx-auto">
            Real experiences from customers and providers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              className={`bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow duration-300 ${idx === 1 || idx === 4 ? 'lg:translate-y-4' : ''}`}
            >
              <Quote className="w-8 h-8 text-violet-200 mb-4" />

              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-medium bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                    {t.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
