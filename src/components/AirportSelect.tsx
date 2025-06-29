'use client'

import { Autocomplete, Loader } from '@mantine/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAirports } from '@/hooks/useAirports'
import { toTitleCasePreserveCode } from '@/app/utils'
import { Airport } from '@/hooks/useOrigin'

interface Props {
  placeholder: string
  initialIata: string
  onChange: (iata: string) => void
  initialError?: string
  initialOptions?: Airport[]
  initialLoading?: boolean
}

export default function AirportSelect({
  placeholder,
  initialIata,
  onChange,
  initialError,
  initialOptions = [],
  initialLoading = false
}: Props) {
  const [query, setQuery] = useState(initialIata)
  const [selected, setSelected] = useState<Airport | null>(null)
  const [validationError, setValidationError] = useState(initialError)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.select()
    }, 0)
  }

  const {
    data: fetchedOptions = [],
    isLoading: fetchedLoading,
    error
  } = useAirports(query, selected !== null)

  useEffect(() => {
    if (initialOptions.length) {
      setSelected(initialOptions[0])
      setQuery(toTitleCasePreserveCode(initialOptions[0].label))
      onChange(initialOptions[0].iata)
    }
  }, [initialOptions, onChange])

  const options = useMemo(() => {
    if (query.trim() === '')
      return [
        ...initialOptions,
        ...fetchedOptions.filter(o => !initialOptions.some(i => i.iata === o.iata))
      ]
    return fetchedOptions
  }, [query, initialOptions, fetchedOptions])

  const labels = useMemo(() => options.map(o => o.label), [options])

  const hydratedOnce = useRef(false)
  useEffect(() => {
    if (!hydratedOnce.current && options.length && initialIata && query === initialIata) {
      const match = options.find(o => o.iata === initialIata)
      if (match) {
        setSelected(match)
        setQuery(toTitleCasePreserveCode(match.label))
      }
      hydratedOnce.current = true
    }
  }, [options, initialIata, query])
  // const hydratedOnce = useRef(false)
  // useEffect(() => {
  //   const match = options.find(o => o.iata === initialIata)
  //   if (!hydratedOnce.current && match) {
  //     setSelected(match)
  //     setQuery(toTitleCasePreserveCode(match.label))
  //     hydratedOnce.current = true
  //   }
  // }, [options, initialIata])

  // const handleValidate = useCallback(() => {
  //   if (!selected && !options.find(o => toTitleCasePreserveCode(o.label) === query)) {
  //     onChange('')
  //     setValidationError('Invalid')
  //   }
  // }, [query, options, selected, onChange])

  const loading = initialLoading || fetchedLoading

  return (
    <Autocomplete
      placeholder={placeholder}
      value={query}
      onFocus={handleFocus}
      ref={inputRef}
      // className={styles.Input}
      onChange={v => {
        const opt = options.find(option => option.label === v)
        if (opt) {
          setSelected(opt)
          setQuery(toTitleCasePreserveCode(opt.label))
          onChange(opt.iata)
        } else {
          setSelected(null)
          setQuery(v)
          onChange('')
        }
      }}
      // onBlur={handleValidate}
      data={labels}
      error={validationError || error?.message || undefined}
      rightSection={loading && <Loader size={14} />}
      miw={200}
      clearable
      size="lg"
    />
  )
}
