import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog & Home Guides | ServiceHub' }

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">ServiceHub Blog</h1>
          <p className="text-slate-600">Home maintenance tips, service hiring guides, and expert advice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: '10 Essential AC Maintenance Tips Before Summer', readTime: '5 min read' },
            { title: 'How to Choose the Right Verified Electrician Near You', readTime: '4 min read' },
          ].map((post) => (
            <Card key={post.title}>
              <CardContent className="p-6 space-y-3">
                <span className="text-xs text-slate-400">{post.readTime}</span>
                <h3 className="font-bold text-slate-900 text-lg">{post.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
