'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <WhereAtFocus
              sentence="Where At"
              manualMode={false}
              blurAmount={5}
              borderColor="#2563eb"
              animationDuration={0.6}
              pauseBetweenAnimations={1.2}
              textSize="text-4xl"
            />
          </div>
          <p className="text-gray-600 text-lg">Dinner With Strangers</p>
        </div>

        <Card className="p-8">
          {!showOtp ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your phone number to continue
                </p>
              </div>
              <Input
                id="phone"
                type="tel"
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 1234567890"
                required
              />
              <Button type="submit" className="w-full" size="lg">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Enter OTP
                </h2>
                <p className="text-gray-600 text-sm">
                  We&apos;ve sent a code to your phone
                </p>
              </div>
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
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowOtp(false)
                  setOtp('')
                }}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

