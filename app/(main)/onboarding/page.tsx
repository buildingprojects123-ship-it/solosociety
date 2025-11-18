'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { INTERESTS } from '@/lib/constants'

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    interests: [] as string[],
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (status === 'authenticated') {
      // Check if profile already exists
      const checkProfile = async () => {
        try {
          const response = await fetch('/api/profile')
          if (response.ok) {
            return true
          } else if (response.status === 404) {
            return false
          }
          return false
        } catch (error) {
          console.error('Error checking profile:', error)
          return false
        }
      }

      checkProfile().then((hasProfile) => {
        if (hasProfile) {
          router.push('/feed')
        }
      })
    }
  }, [status, router])

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]

      return { ...prev, interests: interests.slice(0, 3) }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.city || formData.interests.length !== 3) {
      alert('Please fill in all required fields and select exactly 3 interests')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
          city: formData.city,
          interests: formData.interests,
        }),
      })

      if (response.ok) {
        router.push('/events')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create profile')
      }
    } catch (error) {
      console.error('Profile creation error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Your full name"
            required
          />

          <Input
            id="age"
            type="number"
            label="Age"
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: e.target.value })
            }
            placeholder="18+"
            min="18"
            max="100"
          />

          <Input
            id="city"
            type="text"
            label="City"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="Your city"
            required
          />

          <div>
            <label className="label">
              Select 3 Interests{' '}
              <span className="text-gray-500 font-normal">
                ({formData.interests.length}/3 selected)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((interest) => {
                const isSelected = formData.interests.includes(interest)
                const isDisabled =
                  !isSelected && formData.interests.length >= 3
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={isDisabled}
                    className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md scale-105'
                        : isDisabled
                        ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:shadow-sm'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
          >
            Complete Profile
          </Button>
        </form>
      </Card>
    </div>
  )
}

