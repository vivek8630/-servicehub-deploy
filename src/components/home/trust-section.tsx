import { Shield, Lock, IndianRupee, Star } from 'lucide-react'

const trustItems = [
  {
    icon: Shield,
    title: 'Verified Providers',
    description: 'Every service provider goes through our thorough identity and background verification process.',
    color: 'text-violet-600',
    bg: 'bg-violet-100',
  },
  {
    icon: Lock,
    title: 'Secure Booking',
    description: 'Your data is protected with bank-level encryption and secure session management.',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    description: 'No hidden fees. See exact pricing upfront before confirming your booking.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  {
    icon: Star,
    title: 'Real Customer Reviews',
    description: 'Read verified reviews from real customers who have used the service.',
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
]

export default function TrustSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Why Trust ServiceHub?
          </h2>
          <p className="text-lg text-slate-300 mt-3 max-w-2xl mx-auto">
            We&apos;ve built every feature with your safety, security, and satisfaction in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
