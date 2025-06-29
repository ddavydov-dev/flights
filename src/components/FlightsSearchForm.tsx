'use client'

import { NumberInput, Button, Group, ActionIcon } from '@mantine/core'
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
      {/* <AirportSelect
        placeholder="From"
        initialIata={origin}
        onChange={setOrigin}
        initialError={submitted && !origin ? 'Required' : ''}
        initialOptions={nearbyAirports}
        initialLoading={originLoading}
      /> */}
      <OriginSelect
        initialIata={origin}
        onChange={setOrigin}
        initialError={submitted && !origin ? 'Required' : ''}
      />

      {/* <ActionIcon
        size={36}
        variant="light"
        onClick={swapAirports}
        style={{
          alignSelf: 'center',
          marginTop: 8,
          position: 'absolute',
          top: 4,
          left: 220,
          height: 40,
          width: 40,
          borderRadius: 40,
          border: '2px solid black'
        }}
        title="Swap origin and destination"
      >
        swap
      </ActionIcon> */}

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
        // className={styles.Input}
        // rightSection={
        //   departureDate && (
        //     <ActionIcon variant="transparent" onClick={() => setDepartureDate(null)}>
        //       X
        //     </ActionIcon>
        //   )
        // }
      />
      <DatePickerInput
        value={returnDate}
        onChange={setReturnDate}
        minDate={departureDate ?? undefined}
        miw={200}
        size="lg"
        placeholder="Return"
        clearable
        // className={styles.Input}
        // rightSection={
        //   returnDate && (
        //     <ActionIcon variant="transparent" onClick={() => setReturnDate(null)}>
        //       X
        //     </ActionIcon>
        //   )
        // }
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
