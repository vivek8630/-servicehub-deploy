import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🌱 Seeding database using Prisma...')

  const categories = [
    { id: '1', name: 'Home Repair', slug: 'home-services', description: 'Electricians, plumbers, carpenters, painters', icon: 'Wrench', color: '#7c3aed', sortOrder: 1 },
    { id: '2', name: 'Technology', slug: 'technology', description: 'Laptop repair, phone repair, IT support', icon: 'Monitor', color: '#2563eb', sortOrder: 2 },
    { id: '3', name: 'Education', slug: 'education', description: 'Tutors for all subjects and age groups', icon: 'GraduationCap', color: '#059669', sortOrder: 3 },
    { id: '4', name: 'Automotive', slug: 'automotive', description: 'Car and bike mechanics, car wash, servicing', icon: 'Car', color: '#d97706', sortOrder: 4 },
    { id: '5', name: 'Cleaning', slug: 'cleaning', description: 'Home, office, and deep cleaning services', icon: 'SprayCanIcon', color: '#0891b2', sortOrder: 5 },
    { id: '6', name: 'Creative', slug: 'creative', description: 'Photographers, videographers, graphic designers', icon: 'Camera', color: '#db2777', sortOrder: 6 },
    { id: '7', name: 'Personal Services', slug: 'personal-services', description: 'Salon, makeup, fitness trainers', icon: 'Scissors', color: '#9333ea', sortOrder: 7 },
    { id: '8', name: 'Web & Software', slug: 'web-software', description: 'Web developers, software engineers', icon: 'Code', color: '#0f766e', sortOrder: 8 },
  ]

  // Clear existing (delete dependents first)
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.report.deleteMany()
  await prisma.earning.deleteMany()
  await prisma.portfolioItem.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.session.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  
  await prisma.service.deleteMany()
  await prisma.customerProfile.deleteMany()
  await prisma.providerProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  // Insert Categories
  for (const cat of categories) {
    await prisma.category.create({ data: cat })
  }
  console.log('✅ Categories seeded')

  // Insert Admin
  const adminHash = await bcrypt.hash('Admin@123', 12)
  await prisma.user.create({
    data: { id: 'admin-1', name: 'Admin User', email: 'admin@servicehub.in', passwordHash: adminHash, role: 'ADMIN', phone: '+91 9000000001' }
  })
  console.log('✅ Admin: admin@servicehub.in / Admin@123')

  // Insert Customer
  const customerHash = await bcrypt.hash('Customer@123', 12)
  await prisma.user.create({
    data: { id: 'cust-1', name: 'Ananya Krishnamurthy', email: 'customer@example.com', passwordHash: customerHash, role: 'CUSTOMER', phone: '+91 9876543210' }
  })
  await prisma.customerProfile.create({
    data: { id: 'cp-1', userId: 'cust-1', city: 'Bangalore', address: '123 MG Road, Bangalore' }
  })
  console.log('✅ Customer: customer@example.com / Customer@123')

  // Insert Providers
  const providerHash = await bcrypt.hash('Provider@123', 12)
  const providerData = [
    {
      id: 'prov-1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      city: 'Mumbai',
      location: 'Andheri West, Mumbai',
      bio: 'Expert laptop repair technician with 8 years of experience. Quick troubleshooting and screen replacements.',
      experience: 8,
      rating: 4.9,
      totalReviews: 128,
      completedJobs: 345,
      categoryId: '2',
      serviceName: 'Laptop Screen Repair',
      servicePrice: 499,
      isEmergencyAvailable: false,
      atHomeService: true,
      onlineService: false,
      languages: 'English, Hindi, Marathi',
      latitude: 19.1136,
      longitude: 72.8697
    },
    {
      id: 'prov-2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      city: 'Delhi',
      location: 'Connaught Place, Delhi',
      bio: 'Professional home cleaning expert. Eco-friendly cleaning for homes, offices, and deep sanitation.',
      experience: 5,
      rating: 4.8,
      totalReviews: 96,
      completedJobs: 210,
      categoryId: '5',
      serviceName: 'Deep Home Cleaning',
      servicePrice: 799,
      isEmergencyAvailable: true,
      atHomeService: true,
      onlineService: false,
      languages: 'English, Hindi, Gujarati',
      latitude: 28.6304,
      longitude: 77.2177
    },
    {
      id: 'prov-3',
      name: 'Arjun Mehta',
      email: 'arjun@example.com',
      city: 'Bangalore',
      location: 'Indiranagar, Bangalore',
      bio: 'Award-winning photographer specializing in events, corporate portraits, and creative videography.',
      experience: 6,
      rating: 4.7,
      totalReviews: 84,
      completedJobs: 180,
      categoryId: '6',
      serviceName: 'Event Photography',
      servicePrice: 1999,
      isEmergencyAvailable: false,
      atHomeService: true,
      onlineService: true,
      languages: 'English, Hindi, Kannada',
      latitude: 12.9716,
      longitude: 77.6412
    },
    {
      id: 'prov-4',
      name: 'Suresh Kumar',
      email: 'suresh@example.com',
      city: 'Bangalore',
      location: 'Koramangala, Bangalore',
      bio: '24/7 Emergency Plumber. Specialist in water leaks, tap replacement, pipe cleaning, and bathroom fitting.',
      experience: 10,
      rating: 4.9,
      totalReviews: 142,
      completedJobs: 480,
      categoryId: '1',
      serviceName: 'Emergency Plumbing Fix',
      servicePrice: 299,
      isEmergencyAvailable: true,
      atHomeService: true,
      onlineService: false,
      languages: 'English, Hindi, Tamil, Kannada',
      latitude: 12.9352,
      longitude: 77.6245
    },
    {
      id: 'prov-5',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      city: 'Bangalore',
      location: 'HSR Layout, Bangalore',
      bio: 'Certified electrician for home repairs. AC installation, wiring fixes, fuse boxes, and fan installations.',
      experience: 7,
      rating: 4.8,
      totalReviews: 115,
      completedJobs: 290,
      categoryId: '1',
      serviceName: 'Electrical Repair & Wiring',
      servicePrice: 199,
      isEmergencyAvailable: true,
      atHomeService: true,
      onlineService: false,
      languages: 'English, Hindi, Punjabi, Kannada',
      latitude: 12.9100,
      longitude: 77.6450
    },
    {
      id: 'prov-6',
      name: 'Meena Iyer',
      email: 'meena@example.com',
      city: 'Delhi',
      location: 'Saket, Delhi',
      bio: 'Creative graphic designer and tutor. Branding, UI/UX, and photoshop mentoring.',
      experience: 4,
      rating: 4.6,
      totalReviews: 67,
      completedJobs: 145,
      categoryId: '8',
      serviceName: 'Website UI Design',
      servicePrice: 999,
      isEmergencyAvailable: false,
      atHomeService: false,
      onlineService: true,
      languages: 'English, Hindi, Tamil',
      latitude: 28.5244,
      longitude: 77.2066
    }
  ]

  let profCounter = 1
  for (const pd of providerData) {
    const pId = `prof-${profCounter}`
    await prisma.user.create({
      data: { id: pd.id, name: pd.name, email: pd.email, passwordHash: providerHash, role: 'PROVIDER' }
    })
    
    await prisma.providerProfile.create({
      data: {
        id: pId,
        userId: pd.id,
        bio: pd.bio,
        experience: pd.experience,
        city: pd.city,
        location: pd.location,
        isVerified: true,
        verificationStatus: 'VERIFIED',
        rating: pd.rating,
        totalReviews: pd.totalReviews,
        completedJobs: pd.completedJobs,
        isEmergencyAvailable: pd.isEmergencyAvailable,
        atHomeService: pd.atHomeService,
        onlineService: pd.onlineService,
        languages: pd.languages,
        latitude: pd.latitude,
        longitude: pd.longitude
      }
    })
    
    await prisma.service.create({
      data: { id: `srv-${profCounter}`, providerProfileId: pId, categoryId: pd.categoryId, name: pd.serviceName, description: `Professional ${pd.serviceName} service`, price: pd.servicePrice, priceType: 'starting_from', isActive: true }
    })
    
    console.log(`✅ Provider: ${pd.email} / Provider@123`)
    profCounter++
  }

  console.log('\n🎉 Prisma Seeding complete!')
  console.log('Test accounts:')
  console.log('  Admin:    admin@servicehub.in    / Admin@123')
  console.log('  Customer: customer@example.com   / Customer@123')
  console.log('  Provider: rahul@example.com      / Provider@123')
  console.log('  Provider (Emergency): suresh@example.com / Provider@123')
}

main().catch(console.error)
