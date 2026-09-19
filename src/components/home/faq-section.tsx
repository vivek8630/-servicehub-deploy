'use client'

import { ChevronDown } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How do I book a service?',
    answer:
      'Search for the service you need, browse available providers, view their profiles, ratings, and pricing, then click "Book Service" on a provider\'s profile. Select your preferred date and time, enter your address, and confirm the booking.',
  },
  {
    question: 'How are providers verified?',
    answer:
      'All providers go through a multi-step verification process that includes identity verification, background checks, and review of professional credentials. Only providers who pass all checks receive the "✓ Verified" badge on their profile.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We support UPI, net banking, credit/debit cards, and digital wallets through our secure payment gateway. You can pay online when booking or directly to the provider after service completion.',
  },
  {
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Yes, you can cancel or reschedule a booking from your dashboard up to 2 hours before the scheduled time. Cancellations made less than 2 hours before may be subject to a cancellation fee as per our policy.',
  },
  {
    question: 'What if I am not satisfied with the service?',
    answer:
      'We take quality seriously. If you are unsatisfied, contact our support team within 24 hours of service completion. We will investigate and offer a resolution, which may include a partial refund or re-service.',
  },
  {
    question: 'How do I become a service provider?',
    answer:
      'Click "Become a Provider" on the homepage, create an account as a provider, complete your profile, upload your credentials, and submit for verification. Our team reviews applications within 2-3 business days.',
  },
  {
    question: 'Are the reviews on the platform real?',
    answer:
      'Yes, reviews can only be left by customers who have completed a booking with a provider. This ensures all reviews are genuine and reflect actual service experiences.',
  },
  {
    question: 'How does the refund process work?',
    answer:
      'If your booking is rejected by a provider or cancelled by you within the cancellation window, any payment made is automatically refunded to your original payment method within 5-7 business days.',
  },
]

export default function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto">
            Have questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, contact our support team.
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map((faq, idx) => (
            <Accordion.Item key={idx} value={`item-${idx}`} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex items-center justify-between w-full p-5 text-left hover:bg-slate-50 transition-colors group">
                  <span className="font-medium text-slate-900 text-sm pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-slate-600 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 leading-relaxed">
                  {faq.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
