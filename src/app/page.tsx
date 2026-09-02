import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/hero-section'
import ServiceMoments from '@/components/home/service-moments'
import CategoriesSection from '@/components/home/categories-section'
import EmergencyServices from '@/components/home/emergency-services'
import TopProviders from '@/components/home/top-providers'
import OffersSection from '@/components/home/offers-section'
import HowItWorks from '@/components/home/how-it-works'
import TrustSection from '@/components/home/trust-section'
import Testimonials from '@/components/home/testimonials'
import FAQSection from '@/components/home/faq-section'

export const metadata: Metadata = {
  title: 'ServiceHub — Find Trusted Local Professionals',
  description:
    'Discover, compare, and book reliable local service providers near you. Electricians, plumbers, tutors, photographers, and 50+ more services.',
}

async function getHomePageData() {
  const [categories, topProviders] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    }),
    prisma.providerProfile.findMany({
      where: { isVerified: true, rating: { gte: 4 } },
      orderBy: { rating: 'desc' },
      take: 6,
      include: {
        user: { select: { name: true, image: true } },
        services: {
          where: { isActive: true },
          include: { category: true },
          take: 2,
          orderBy: { price: 'asc' },
        },
      },
    }),
  ])

  return { categories, topProviders }
}

export default async function HomePage() {
  const { categories, topProviders } = await getHomePageData()

  return (
    <>
      <HeroSection />
      <ServiceMoments />
      <CategoriesSection categories={categories} />
      <EmergencyServices />
      <TopProviders providers={topProviders} />
      <OffersSection />
      <HowItWorks />
      <TrustSection />
      <Testimonials />
      <FAQSection />
    </>
  )
}
