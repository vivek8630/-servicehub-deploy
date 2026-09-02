import Link from 'next/link'
import { Wrench, Globe, MessageCircle, Share2, Mail } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  Services: [
    { label: 'Home Repair', href: '/services?category=home-services' },
    { label: 'Technology', href: '/services?category=technology' },
    { label: 'Education', href: '/services?category=education' },
    { label: 'Beauty & Wellness', href: '/services?category=personal-services' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety', href: '/safety' },
    { label: 'Report an Issue', href: '/report' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Service<span className="text-violet-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Connecting customers with trusted local service professionals across India.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-violet-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-violet-600 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-violet-600 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="mailto:hello@servicehub.in"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-violet-600 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 ServiceHub. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
