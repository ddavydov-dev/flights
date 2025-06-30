'use client'

import { useFlightsSearchParams } from '@/features/flights/hooks'
import { FlightOfferDTO } from '@/features/flights/types'
import { useCreateOrder } from '@/features/orders/hooks'
import { Card, Group, Text, Button, Stack } from '@mantine/core'
import { useRouter } from 'next/navigation'

function fmtDuration(iso: string): string {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso)
  if (!m) return iso
  const [, h = '', min = ''] = m
  return `${h ? `${h} h ` : ''}${min ? `${min} m` : ''}`.trim()
}

export default function FlightCard({
  price,
  currency,
  carrier,
  origin,
  destination,
  departureTime,
  arrivalTime,
  duration,
  stops,
  cabin,
  bags,
  raw
}: FlightOfferDTO) {
  const { passengers } = useFlightsSearchParams()
  const { mutateAsync: createOrder, isPending } = useCreateOrder()
  const router = useRouter()

  return (
    <>
      <Card shadow="sm" withBorder>
        <Group align="center" wrap="nowrap">
          <Stack mr="auto">
            <Text fw={700} size="lg">
              {origin} → {destination}
            </Text>
            <Text size="sm" c="dimmed">
              {carrier} •{' '}
              {new Date(departureTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
              &nbsp; →&nbsp;
              {new Date(arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text size="sm" c="dimmed">
              {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`} •{' '}
              {fmtDuration(duration)} • {cabin}
              {bags !== null ? ` • ${bags} bag${bags !== 1 ? 's' : ''}` : ''}
            </Text>
          </Stack>

          <Group align="center">
            <Text fw={700} size="lg">
              {currency} {price}
            </Text>
            <Button
              variant="outline"
              loading={isPending}
              onClick={async () => {
                const { id } = await createOrder({ flightOffer: raw, passengers })
                router.push(`/orders/${id}`)
              }}
            >
              Book
            </Button>
          </Group>
        </Group>
      </Card>
    </>
  )
}
