import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useAirports } from '@/hooks/useAirports'
import { useOrigin } from '@/hooks/useOrigin'
import { LocationDTO } from '@/app/types'
import { fetchAirports } from '@/api/fetchAirports'

interface UseAirportSelectArgs {
  initialIata: string
  withNearby: boolean
  onChange: (iata: string) => void
}

interface State {
  inputValue: string
  selected: LocationDTO | null
}

type Action =
  | { type: 'SET_INPUT'; value: string }
  | { type: 'SET_SELECTED'; airport: LocationDTO }
  | { type: 'RESET_SELECTED' }
  | { type: 'SET_DEFAULT'; airport: LocationDTO }

const initialState: State = { inputValue: '', selected: null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputValue: action.value }
    case 'SET_SELECTED':
      return { inputValue: action.airport.label, selected: action.airport }
    case 'RESET_SELECTED':
      return { ...state, selected: null }
    case 'SET_DEFAULT':
      return { inputValue: action.airport.label, selected: action.airport }
    default:
      return state
  }
}

export function useAirportSelect({ initialIata, withNearby, onChange }: UseAirportSelectArgs) {
  const [{ inputValue, selected }, dispatch] = useReducer(reducer, initialState)
  const prevAutoDefault = useRef<LocationDTO | null>(null)
  const justSelected = useRef(false)
  const ignoreNextEmpty = useRef(false)

  const {
    data: nearbyAirports = [],
    isPending: nearbyLoading,
    error: nearbyError
  } = useOrigin(withNearby)

  const effectiveQuery =
    inputValue.trim() !== '' && inputValue !== selected?.label ? inputValue : ''

  const {
    data: fetchedAirports = [],
    isPending: searchLoading,
    error: searchError
  } = useAirports(effectiveQuery)

  useEffect(() => {
    if (!initialIata || selected?.iataCode === initialIata) return

    const localMatch = [...nearbyAirports, ...fetchedAirports].find(a => a.iataCode === initialIata)

    if (localMatch) {
      dispatch({ type: 'SET_SELECTED', airport: localMatch })
      return
    }

    fetchAirports(initialIata)
      .then(list => {
        const match = list.find(a => a.iataCode === initialIata)
        if (match) dispatch({ type: 'SET_SELECTED', airport: match })
      })
      .catch(console.error)
  }, [initialIata, selected, nearbyAirports, fetchedAirports])

  useEffect(() => {
    if (
      !withNearby ||
      initialIata ||
      selected ||
      inputValue.trim() !== '' ||
      nearbyAirports.length === 0
    )
      return
    dispatch({ type: 'SET_DEFAULT', airport: nearbyAirports[0] })
    prevAutoDefault.current = nearbyAirports[0]
    onChange(nearbyAirports[0].iataCode)
  }, [withNearby, initialIata, selected, nearbyAirports, onChange])

  const airports = useMemo(() => {
    const merged: LocationDTO[] = [...nearbyAirports]

    fetchedAirports.forEach(f => {
      if (!merged.some(n => n.iataCode === f.iataCode)) merged.push(f)
    })

    if (selected && !merged.some(a => a.iataCode === selected.iataCode)) {
      merged.push(selected)
    }

    return merged
  }, [nearbyAirports, fetchedAirports, selected])

  const dropdownOptions = useMemo(() => {
    const showNearby = inputValue.trim() === '' || inputValue === selected?.label

    const base = showNearby ? nearbyAirports : fetchedAirports

    const withSelection =
      selected && !base.some(a => a.iataCode === selected.iataCode) ? [...base, selected] : base

    return withSelection.map(a => ({
      value: a.iataCode,
      label: a.label,
      airport: a
    }))
  }, [inputValue, selected, nearbyAirports, fetchedAirports])

  const onSearchChange = useCallback((v: string) => {
    if (v === '' && ignoreNextEmpty.current) {
      ignoreNextEmpty.current = false
      return
    }

    if (v === '' && selected && inputValue === selected.label) {
      dispatch({ type: 'SET_INPUT', value: '' })
      return
    }

    if (selected && v !== selected.label) {
      dispatch({ type: 'RESET_SELECTED' })
    }

    dispatch({ type: 'SET_INPUT', value: v })
  }, [])

  const onOptionSubmit = useCallback(
    (iata: string) => {
      const match = airports.find(a => a.iataCode === iata)
      if (!match) return
      justSelected.current = true
      prevAutoDefault.current = null
      dispatch({ type: 'SET_SELECTED', airport: match })
      onChange(iata)
    },
    [airports, onChange]
  )

  const onBlur = useCallback(() => {
    if (inputValue.trim() === '' && selected) {
      ignoreNextEmpty.current = true
      dispatch({ type: 'SET_INPUT', value: selected.label })
      return
    }

    if (inputValue.trim() === '' && !selected) {
      if (prevAutoDefault.current) {
        dispatch({ type: 'SET_SELECTED', airport: prevAutoDefault.current })
      } else {
        onChange('')
      }
      return
    }

    if (selected) onChange(selected.iataCode)
  }, [inputValue, selected, onChange])

  return {
    selectedIata: selected?.iataCode ?? '',
    searchValue: inputValue,
    airports,
    loading: nearbyLoading || searchLoading,
    error: nearbyError ?? searchError,
    dropdownOptions,
    onSearchChange,
    onOptionSubmit,
    onBlur
  }
}
