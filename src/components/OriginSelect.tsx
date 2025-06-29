'use client'

import { Group, Select, SelectProps, Text } from '@mantine/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAirports } from '@/hooks/useAirports'
import { useOrigin } from '@/hooks/useOrigin'

interface Props {
  initialIata: string
  onChange: (iata: string) => void
  initialError?: string
}

export default function OriginSelect({ initialIata, onChange, initialError }: Props) {
  const [query, setQuery] = useState(initialIata)
  const [value, setValue] = useState<string | null>(initialIata ?? null)

  const inputRef = useRef<HTMLInputElement>(null)
  const { data: nearbyAirports = [], isLoading: originLoading } = useOrigin()

  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.select()
    }, 0)
  }

  const { data: fetchedOptions = [], isLoading: fetchedLoading, error } = useAirports(query, true)

  const setOnce = useRef(false)
  useEffect(() => {
    if (!setOnce.current && nearbyAirports.length && query.length === 0) {
      setValue(nearbyAirports[0].iata)
      setQuery(nearbyAirports[0].label)
      onChange(nearbyAirports[0].iata)

      setOnce.current = true
    }
  }, [nearbyAirports, onChange, query])

  const airports = useMemo(
    () => [
      ...nearbyAirports,
      ...fetchedOptions.filter(o => !nearbyAirports.some(n => n.iata === o.iata))
    ],
    [nearbyAirports, fetchedOptions]
  )

  const options = useMemo(() => {
    if (query === '' || nearbyAirports.some(i => i.label === query || i.iata === query)) {
      return nearbyAirports.map(i => ({ value: i.iata, label: i.label }))
    } else {
      return fetchedOptions.map(i => ({ value: i.iata, label: i.label }))
    }
  }, [fetchedOptions, query, nearbyAirports])

  const hydratedOnce = useRef(false)
  useEffect(() => {
    if (!hydratedOnce.current && options.length && initialIata && query === initialIata) {
      const match = options.find(o => o.value === initialIata)
      if (match) {
        setValue(match.value)
        setQuery(match.label)
      }
      hydratedOnce.current = true
    }
  }, [options, initialIata, query])

  const loading = originLoading || fetchedLoading

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
    const item = airports.find(o => o.label === option.label)!
    return (
      <div>
        <Group gap={6}>
          <Text>{item.city}</Text>
          <Text c="gray">{item.iata}</Text>
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
      value={value}
      onChange={next => {
        setValue(next)
        setQuery(next ? options.find(o => o.value === next)!.label : '')
        onChange(next ?? '')
      }}
      placeholder={'From'}
      onFocus={handleFocus}
      ref={inputRef}
      size="lg"
      aria-label="Origin"
      nothingFoundMessage={loading ? 'Loading...' : 'Nothing found'}
      searchValue={query}
      allowDeselect={false}
      onSearchChange={v => {
        setQuery(v)

        // const currentLabel = value ? options.find(o => o.value === value)?.label : undefined
        // if (v === currentLabel) return

        // if (v === '') {
        //   //   if (value !== null) onChange('') // notify parent once
        //   //   setValue(null) // drop selection
        //   return // keep query = ''
        // }

        // if (value !== null) {
        //   setValue(null)
        //   onChange('')
        // }
      }}
      onOptionSubmit={val => {
        const opt = options.find(o => o.value === val)!
        setValue(val)
        setQuery(opt.label)
        onChange(val)
      }}
      data={options}
      error={initialError || error?.message || undefined}
      miw={200}
      withCheckIcon={false}
      comboboxProps={{ width: 300, position: 'bottom-start', radius: 'lg' }}
      renderOption={renderSelectOption}
      rightSectionWidth={12}
      rightSection={<></>} // Hide badge
      filter={() => options}
    />
  )
}
