'use client'

import { NumberInput, Button, Group } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useRouter } from 'next/navigation'
import AirportSelect from './AirportSelect'
import { useFlightsSearchForm } from '@/hooks/useFlightsSearchForm'
import { useState } from 'react'
import OriginSelect from './OriginSelect'

import styles from './OriginSelect.module.css'

export default function FlightsSearchForm() {
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
  } = useFlightsSearchForm()

  // const { data: nearbyAirports = [], isLoading: originLoading } = useOrigin(true)

  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)

  // const swapAirports = () => {
  //   setOrigin(destination)
  //   setDestination(origin)
  // }

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
    <Group grow wrap="wrap" justify="center" align="flex-start" gap={0} className={styles.Input}>
      <OriginSelect
        initialIata={origin}
        onChange={setOrigin}
        initialError={submitted && !origin ? 'Required' : ''}
      />

      <AirportSelect
        placeholder="Where"
        initialIata={destination}
        onChange={setDestination}
        initialError={submitted && !destination ? 'Required' : ''}
      />

      <DatePickerInput
        value={departureDate}
        onChange={setDepartureDate}
        error={submitted && !departureDate && 'Required'}
        miw={200}
        size="lg"
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
        size="lg"
        placeholder="Return"
        clearable
      />
      <NumberInput
        // label="Passengers"
        value={passengers}
        onChange={val => setPassengers(+val)}
        min={1}
        error={submitted && !passengers && 'Required'}
        miw={160}
        // className={styles.Input}
        size="lg"
      />
      <Button
        size="lg"
        onClick={handleSubmit}
        miw={160}
        style={{ alignSelf: 'flex-start', borderRadius: 16 }}
        ml={10}
      >
        Search
      </Button>
    </Group>
  )
}
