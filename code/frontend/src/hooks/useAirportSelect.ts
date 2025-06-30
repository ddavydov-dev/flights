import { useEffect, useMemo, useRef, useState } from 'react'
import { useAirports } from '@/hooks/useAirports'
import { useOrigin } from '@/hooks/useOrigin'

interface UseAirportSelectArgs {
  initialIata: string
  withNearby: boolean
  onChange: (iata: string) => void
}

export function useAirportSelect({ initialIata, withNearby, onChange }: UseAirportSelectArgs) {
  const [{ selectedIata, searchValue, remoteQuery }, setState] = useState({
    selectedIata: initialIata,
    searchValue: '',
    remoteQuery: ''
  })

  const { data: nearbyAirports = [], isPending: originLoading } = useOrigin(withNearby)
  const { data: fetchedOptions = [], isPending: fetchedLoading, error } = useAirports(remoteQuery)

  const didSetDefault = useRef(false)
  useEffect(() => {
    if (withNearby && !didSetDefault.current && !initialIata && nearbyAirports.length) {
      const first = nearbyAirports[0]
      setState({ selectedIata: first.iataCode, searchValue: first.label, remoteQuery: '' })
      onChange(first.iataCode)
      didSetDefault.current = true
    }
  }, [withNearby, nearbyAirports, initialIata, onChange])

  useEffect(() => {
    if (
      initialIata &&
      searchValue === '' &&
      remoteQuery === '' &&
      !nearbyAirports.some(a => a.iataCode === initialIata)
    ) {
      setState(prev => ({ ...prev, remoteQuery: initialIata }))
    }
  }, [initialIata, searchValue, remoteQuery, nearbyAirports])

  useEffect(() => {
    if (initialIata && searchValue === '') {
      const match = fetchedOptions.find(a => a.iataCode === initialIata)
      if (match) {
        setState(prev => ({ ...prev, searchValue: match.label, remoteQuery: '' }))
      }
    }
  }, [initialIata, searchValue, fetchedOptions])

  const airports = useMemo(() => {
    return [
      ...nearbyAirports,
      ...fetchedOptions.filter(o => !nearbyAirports.some(n => n.iataCode === o.iataCode))
    ]
  }, [nearbyAirports, fetchedOptions])

  const dropdownOptions = useMemo(() => {
    const base =
      searchValue === '' || nearbyAirports.some(a => a.iataCode === selectedIata)
        ? nearbyAirports
        : fetchedOptions
    return base.map(a => ({ value: a.iataCode, label: a.label }))
  }, [searchValue, selectedIata, nearbyAirports, fetchedOptions])

  const onSearchChange = (val: string) => {
    const match = airports.find(a => a.label === val)
    setState({ searchValue: val, remoteQuery: val, selectedIata: match?.iataCode ?? '' })
  }

  const onOptionSubmit = (val: string) => {
    const match = airports.find(a => a.iataCode === val)
    setState({ selectedIata: val, searchValue: match?.label ?? '', remoteQuery: '' })
    onChange(val)
  }

  const onBlur = () => {
    if (searchValue === '') setState(prev => ({ ...prev, selectedIata: '' }))
    onChange(selectedIata)
  }

  const loading = originLoading || fetchedLoading

  return {
    selectedIata,
    searchValue,
    loading,
    error,
    dropdownOptions,
    airports,
    onSearchChange,
    onOptionSubmit,
    onBlur
  }
}
