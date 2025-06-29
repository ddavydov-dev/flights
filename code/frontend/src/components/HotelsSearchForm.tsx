'use client'

import { useHotelsSearchForm } from '@/hooks/useHotelsSearchForm'
import { NumberInput, Button, Group, ActionIcon, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useRouter } from 'next/navigation'

export default function HotelsSearchForm() {
  const { city, setCity, checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults } =
    useHotelsSearchForm()

  const router = useRouter()

  const handleSubmit = () => {
    if (!city || !checkIn || !adults) return // basic guard

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
        label="City"
        value={city}
        onChange={e => setCity(e.currentTarget.value)}
        error={!city && 'Required'}
        miw={160}
      />

      <DatePickerInput
        label="Check in date"
        value={checkIn}
        onChange={setCheckIn}
        error={!checkIn && 'Required'}
        miw={160}
        minDate={new Date()}
        maxDate={checkOut ?? undefined}
        placeholder="2025-06-30"
        rightSection={
          checkIn && (
            <ActionIcon variant="transparent" onClick={() => setCheckIn(null)}>
              X
            </ActionIcon>
          )
        }
      />
      <DatePickerInput
        label="Check out date (optional)"
        value={checkOut}
        onChange={setCheckOut}
        minDate={checkIn ?? undefined}
        miw={160}
        placeholder="2025-07-07"
        rightSection={
          checkOut && (
            <ActionIcon variant="transparent" onClick={() => setCheckOut(null)}>
              X
            </ActionIcon>
          )
        }
      />
      <NumberInput
        label="Adults"
        value={adults}
        onChange={val => setAdults(+val)}
        min={1}
        error={!adults && 'Required'}
        miw={160}
      />
      <Button onClick={handleSubmit} miw={160} style={{ alignSelf: 'flex-end' }}>
        Search
      </Button>
    </Group>
  )
}
