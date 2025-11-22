'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { INTERESTS } from '@/lib/constants'
import ProfileTabs from '@/components/profile/ProfileTabs'

type TabType = 'posts' | 'events' | 'dinners' | 'places'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    interests: [] as string[],
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || '',
          age: data.age?.toString() || '',
          city: data.city || '',
          interests: data.interests || [],
        })
      } else if (response.status === 404) {
        router.push('/onboarding')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setFetching(false)
    }
  }

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
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-card border border-white/5 rounded-xl p-6 md:p-8 shadow-lg shadow-black/20 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{formData.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {formData.age && <span>Age: {formData.age}</span>}
                <span>📍 {formData.city}</span>
                {session?.user?.phone && <span>📱 {session.user.phone}</span>}
              </div>
            </div>
            {!isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="bg-white/5 hover:bg-white/10 border-white/10 text-foreground">
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  id="name"
                  type="text"
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-secondary/50 border-white/10 text-foreground focus:border-primary/50"
                />
                <Input
                  id="age"
                  type="number"
                  label="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="18"
                  max="100"
                  className="bg-secondary/50 border-white/10 text-foreground focus:border-primary/50"
                />
              </div>

              <Input
                id="city"
                type="text"
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="bg-secondary/50 border-white/10 text-foreground focus:border-primary/50"
              />

              <div>
                <label className="label text-foreground">
                  Interests{' '}
                  <span className="text-muted-foreground font-normal">
                    ({formData.interests.length}/3 selected)
                  </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTERESTS.map((interest) => {
                    const isSelected = formData.interests.includes(interest)
                    const isDisabled = !isSelected && formData.interests.length >= 3
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        disabled={isDisabled}
                        className={`px-4 py-3 rounded-lg border transition-all duration-200 font-medium ${isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                            : isDisabled
                              ? 'bg-secondary/30 text-muted-foreground border-white/5 cursor-not-allowed opacity-50'
                              : 'bg-secondary/50 text-foreground border-white/10 hover:border-primary/50 hover:bg-secondary/80'
                          }`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" loading={loading}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-foreground"
                  onClick={() => {
                    setIsEditing(false)
                    fetchProfile()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="primary" className="bg-primary/10 text-primary border-primary/20">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
