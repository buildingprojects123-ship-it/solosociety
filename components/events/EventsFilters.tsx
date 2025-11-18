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
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      {/* Event Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type)
                handleFilterChange()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <div className="flex flex-wrap gap-2">
          {['all', 'today', 'this-week', 'this-month'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setDateRange(range)
                handleFilterChange()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value)
            handleFilterChange()
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

