import { Search, GitCompare, Calendar, CheckCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Search',
    description: 'Search for the service you need and browse providers in your area.',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    step: '02',
    icon: GitCompare,
    title: 'Compare',
    description: 'Compare ratings, reviews, experience, and pricing to find your best match.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    step: '03',
    icon: Calendar,
    title: 'Book',
    description: 'Select your preferred date, time, and confirm your booking instantly.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    step: '04',
    icon: CheckCircle,
    title: 'Get the Service',
    description: 'Your provider arrives, completes the job, and you leave a review.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">How ServiceHub Works</h2>
          <p className="section-subtitle mx-auto">
            Getting professional help has never been easier. Four simple steps to get your service done.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-violet-200 via-emerald-200 to-amber-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.step} className="flex flex-col items-center text-center group">
                {/* Step number & icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500">{idx + 1}</span>
                  </div>
                </div>

                <div className={`${step.bg} ${step.border} border rounded-2xl p-6 w-full`}>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
