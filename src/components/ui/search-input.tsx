'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { debounce } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  debounceMs?: number
  className?: string
}

export function SearchInput({
  placeholder = "Cerca...",
  value = "",
  onChange,
  debounceMs = 300,
  className
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value)

  const debouncedOnChange = debounce(onChange, debounceMs)

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setSearchValue(newValue)
    debouncedOnChange(newValue)
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}