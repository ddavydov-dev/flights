import { NumberInput, Button, Group } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useRouter } from 'next/navigation'
import AirportSelect from './AirportSelect'
import { useState } from 'react'
import { useFlightsSearchForm } from '@/features/flights/hooks'

interface FlightsSearchFormProps {
  syncToUrl?: boolean
}

export default function FlightsSearchForm({ syncToUrl }: FlightsSearchFormProps) {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    setPassengers
  } = useFlightsSearchForm(syncToUrl)

  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    if (!origin || !destination || !departureDate || !passengers) return

    const params = new URLSearchParams({
      origin,
      destination,
      ...(departureDate ? { departureDate } : {}),
      ...(returnDate ? { returnDate } : {}),
      passengers
    })

    router.push(`/flights?${params.toString()}`)
  }

  return (
    <Group grow wrap="wrap" justify="center" align="flex-start">
      <AirportSelect
        placeholder="From"
        ariaLabel="From"
        initialIata={origin}
        onChange={setOrigin}
        initialError={submitted && !origin ? 'Required' : ''}
        withNearby
      />
      <AirportSelect
        placeholder="Where"
        ariaLabel="Where"
        initialIata={destination}
        onChange={setDestination}
        initialError={submitted && !destination ? 'Required' : ''}
      />

      <DatePickerInput
        value={departureDate}
        onChange={setDepartureDate}
        error={submitted && !departureDate && 'Required'}
        miw={200}
        size="md"
        minDate={new Date()}
        maxDate={returnDate ?? undefined}
        placeholder="Departure"
        clearable
      />
      <DatePickerInput
        value={returnDate}
        onChange={setReturnDate}
        minDate={departureDate ?? undefined}
        miw={200}
        size="md"
        placeholder="Return"
        clearable
      />
      <NumberInput
        value={passengers}
        onChange={val => setPassengers(+val)}
        min={1}
        error={submitted && !passengers && 'Required'}
        miw={200}
        size="md"
      />
      <Button
        size="md"
        onClick={handleSubmit}
        miw={160}
        style={{ alignSelf: 'flex-start' }}
        ml={10}
      >
        Search
      </Button>
    </Group>
  )
}
