'use client'

import { useAirportSelect } from '@/shared/hooks'
import { Group, Select, SelectProps, Text } from '@mantine/core'
import { useCallback, useRef } from 'react'

interface AirportSelectProps {
  initialIata: string
  onChange: (iata: string) => void
  withNearby?: boolean
  initialError?: string
  placeholder: string
  ariaLabel: string
}

export default function AirportSelect({
  initialIata,
  onChange,
  withNearby = false,
  initialError,
  placeholder,
  ariaLabel
}: AirportSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    selectedIata,
    searchValue,
    loading,
    error,
    dropdownOptions,
    airports,
    onSearchChange,
    onOptionSubmit,
    onBlur
  } = useAirportSelect({ initialIata, withNearby, onChange })

  const handleFocus = useCallback(() => {
    setTimeout(() => inputRef.current?.select(), 0)
  }, [inputRef])

  const renderOption: SelectProps['renderOption'] = ({ option }) => {
    const item = airports.find(a => a.label === option.label)!
    return (
      <div>
        <Group gap={6}>
          <Text>{item.city}</Text>
          <Text c="gray">{item.iataCode}</Text>
        </Group>
        <Text c="gray" size="sm">
          {item.country}
        </Text>
      </div>
    )
  }

  return (
    <Select
      searchable
      value={selectedIata}
      searchValue={searchValue}
      placeholder={placeholder}
      aria-label={ariaLabel}
      ref={inputRef}
      size="md"
      allowDeselect={false}
      onFocus={handleFocus}
      onSearchChange={onSearchChange}
      onOptionSubmit={onOptionSubmit}
      onBlur={onBlur}
      data={dropdownOptions}
      nothingFoundMessage={
        searchValue && loading
          ? 'Loading...'
          : !loading && searchValue
          ? 'Nothing found'
          : undefined
      }
      error={initialError || error?.message || undefined}
      miw={200}
      withCheckIcon={false}
      comboboxProps={{ width: 300, position: 'bottom-start', radius: 'sm' }}
      renderOption={renderOption}
      rightSectionWidth={12}
      rightSection={<></>}
      filter={() => dropdownOptions}
    />
  )
}
