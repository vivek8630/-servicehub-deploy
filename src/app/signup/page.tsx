'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, User, Phone, Wrench, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUpSchema, type SignUpInput } from '@/lib/validations'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: 'CUSTOMER', terms: false },
  })

  const selectedRole = watch('role')
  const terms = watch('terms')

  const onSubmit = async (data: SignUpInput) => {
    setServerError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error || 'Signup failed. Please try again.')
        return
      }

      const { user } = json
      if (user.role === 'PROVIDER') router.push('/provider/dashboard')
      else router.push('/dashboard')
      router.refresh()
    } catch {
      setServerError('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            Service<span className="text-violet-600">Hub</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Create your account</h1>
          <p className="text-slate-500 mt-1">Join thousands of users on ServiceHub</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {serverError}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">I want to</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'CUSTOMER', label: 'Find Services', desc: 'Book professionals' },
                  { value: 'PROVIDER', label: 'Offer Services', desc: 'Earn as a provider' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('role', opt.value as 'CUSTOMER' | 'PROVIDER')}
                    className={cn(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      selectedRole === opt.value
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {selectedRole === opt.value && (
                        <CheckCircle className="w-4 h-4 text-violet-600 shrink-0" />
                      )}
                      <div>
                        <p className={cn('text-sm font-medium', selectedRole === opt.value ? 'text-violet-700' : 'text-slate-700')}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-500">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="signup-name"
              type="text"
              label="Full Name"
              placeholder="John Smith"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              id="signup-email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="signup-phone"
              type="tel"
              label="Phone Number"
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              helperText="Optional"
              {...register('phone')}
            />

            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Min. 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Re-enter your password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1} className="text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="signup-terms"
                  type="checkbox"
                  className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  checked={terms}
                  onChange={(e) => setValue('terms', e.target.checked)}
                />
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>}
            </div>

            <Button
              id="signup-submit"
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-600 font-medium hover:text-violet-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
