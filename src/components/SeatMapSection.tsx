'use client'

import { useState } from 'react'
import { Button, Group, Skeleton, Stack, Text } from '@mantine/core'
import { useOrder } from '@/hooks/useOrder'
import { useSeatMapByOrder } from '@/hooks/useSeatMapByOrder'

export default function SeatMapSection({ orderId }: { orderId: string }) {
  const { data: order } = useOrder(orderId)
  const { data: seats = [], isLoading } = useSeatMapByOrder(orderId)
  console.log('💶 seats:', seats)
  const [selected, setSelected] = useState<string[]>([])

  if (!order) return <Skeleton height={200} mt="md" />

  const { offer } = order

  const itinerary = offer.itineraries[0]
  const seg0 = itinerary.segments[0]
  const segN = itinerary.segments.at(-1)!

  return (
    <Stack mt="md">
      <Text fw={700}>
        {seg0.departure.iataCode} → {segN.arrival.iataCode} •{' '}
        {new Date(seg0.departure.at).toLocaleString()}
      </Text>

      {isLoading && <Skeleton height={400} radius="md" />}
      {!isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(...seats.map(s => s.col))}, 32px)`,
            gridTemplateRows: `repeat(${Math.max(...seats.map(s => s.row))}, 32px)`,
            gap: 4,
            justifyContent: 'center'
          }}
        >
          {seats.map(s => {
            const picked = selected.includes(s.id)
            const bg = !s.available ? '#e03131' : picked ? '#1971c2' : '#dee2e6'
            return (
              <Text
                key={s.id}
                ta="center"
                style={{
                  gridArea: `${s.row + 1} / ${s.col + 1}`,
                  cursor: s.available ? 'pointer' : 'default',
                  border: '1px solid #adb5bd',
                  borderRadius: 4,
                  background: bg,
                  userSelect: 'none'
                }}
                onClick={() =>
                  s.available &&
                  setSelected(prev =>
                    prev.includes(s.id) ? prev.filter(n => n !== s.id) : [...prev, s.id]
                  )
                }
              >
                {s.id}
              </Text>
            )
          })}
        </div>
      )}

      <Group justify="space-between">
        <Text size="sm">Selected: {selected.join(', ') || '—'}</Text>
        <Button
          disabled={!selected.length}
          onClick={async () => {
            await fetch(`/api/orders/${orderId}`, {
              method: 'PATCH',
              body: JSON.stringify({ seats: selected })
            })
            alert('Seats saved!')
          }}
        >
          Save seats
        </Button>
      </Group>
    </Stack>
  )
}
