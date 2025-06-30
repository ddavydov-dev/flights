'use client'

import { useHotelsSearchForm } from '@/hooks/useHotelsSearchForm'
import { NumberInput, Button, Group, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useRouter } from 'next/navigation'

export default function HotelsSearchForm() {
  const { city, setCity, checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults } =
    useHotelsSearchForm()

  const router = useRouter()

  const handleSubmit = () => {
    if (!city || !checkIn || !adults) return

    const params = new URLSearchParams({
      city,
      checkIn,
      ...(checkOut ? { checkOut } : {}),
      adults: adults.toString()
    })

    router.push(`/hotels?${params.toString()}`)
  }

  return (
    <Group grow wrap="wrap" justify="center" align="flex-start">
      <TextInput
        value={city}
        onChange={e => setCity(e.currentTarget.value)}
        error={!city && 'Required'}
        placeholder="City"
        size="md"
        miw={160}
      />

      <DatePickerInput
        value={checkIn}
        onChange={setCheckIn}
        error={!checkIn && 'Required'}
        miw={160}
        minDate={new Date()}
        maxDate={checkOut ?? undefined}
        placeholder="Check in"
        clearable
        size="md"
      />
      <DatePickerInput
        value={checkOut}
        onChange={setCheckOut}
        minDate={checkIn ?? undefined}
        miw={160}
        placeholder="Check out"
        clearable
        size="md"
      />

      <NumberInput
        value={adults}
        placeholder="Adults"
        onChange={val => setAdults(+val)}
        min={1}
        error={!adults && 'Required'}
        miw={160}
        size="md"
      />
      <Button onClick={handleSubmit} miw={160} size="md">
        Search
      </Button>
    </Group>
  )
}
