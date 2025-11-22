'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import WhereAtFocus from '@/components/ui/WhereAtFocus'
import { MOCK_OTP } from '@/lib/constants'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.trim()) {
      setShowOtp(true)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        phone,
        otp,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/onboarding')
        router.refresh()
      } else {
        alert('Invalid OTP. Please use 000000')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden antialiased selection:bg-primary/20 selection:text-primary">
      {/* Spotlight Effect */}
      <div className="absolute inset-0 w-full h-full bg-background">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px] animate-spotlight opacity-0" />
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10 px-4">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <WhereAtFocus
              sentence="Where At"
              manualMode={false}
              blurAmount={5}
              borderColor="#3b82f6"
              glowColor="rgba(59, 130, 246, 0.5)"
              animationDuration={0.8}
              pauseBetweenAnimations={1.5}
              textSize="text-5xl"
            />
          </div>
          <p className="text-zinc-400 text-lg tracking-wide font-light">Dinner With Strangers</p>
        </div>

        <div className="glass-card p-8 rounded-2xl shadow-2xl shadow-black/50">
          {!showOtp ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-zinc-400 text-sm">
                  Enter your phone number to continue
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 1234567890"
                  required
                  className="bg-zinc-900/50 border-white/10 focus:border-primary/50 text-white placeholder:text-zinc-600"
                />
                <Button type="submit" className="w-full font-semibold shadow-lg shadow-primary/20" size="lg">
                  Send OTP
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Enter OTP
                </h2>
                <p className="text-zinc-400 text-sm">
                  We&apos;ve sent a code to your phone
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  id="otp"
                  type="text"
                  label="OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={MOCK_OTP}
                  required
                  maxLength={6}
                  helperText={`Use code ${MOCK_OTP} for any phone number`}
                  className="bg-zinc-900/50 border-white/10 focus:border-primary/50 text-white placeholder:text-zinc-600"
                />
                <Button
                  type="submit"
                  className="w-full font-semibold shadow-lg shadow-primary/20"
                  size="lg"
                  loading={loading}
                >
                  Verify OTP
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-zinc-400 hover:text-white hover:bg-white/5"
                  onClick={() => {
                    setShowOtp(false)
                    setOtp('')
                  }}
                >
                  Change Phone Number
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

