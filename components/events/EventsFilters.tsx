'use client'

import { useState } from 'react'

// TODO: Replace with real data from API
const eventTypes = ['All', 'Dinner', 'Concert', 'Party', 'Meetup', 'Workshop']
const cities = ['All Cities', 'Mumbai', 'Bangalore', 'Delhi', 'Pune']

export default function EventsFilters() {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [dateRange, setDateRange] = useState('all')

  // TODO: Implement actual filtering logic
  const handleFilterChange = () => {
    // Update URL params or trigger data refetch
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl p-4 space-y-4 shadow-lg shadow-black/20">
      {/* Event Type Filter */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Type</label>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type)
                handleFilterChange()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedType === type
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-white/5 hover:border-white/10'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Date</label>
        <div className="flex flex-wrap gap-2">
          {['all', 'today', 'this-week', 'this-month'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setDateRange(range)
                handleFilterChange()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${dateRange === range
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-white/5 hover:border-white/10'
                }`}
            >
              {range === 'all'
                ? 'All Dates'
                : range === 'today'
                  ? 'Today'
                  : range === 'this-week'
                    ? 'This Week'
                    : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value)
            handleFilterChange()
          }}
          className="px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent w-full md:w-auto"
        >
          {cities.map((city) => (
            <option key={city} value={city} className="bg-zinc-900 text-foreground">
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

