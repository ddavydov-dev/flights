'use client'

import { SeatDTO } from '@/api/fetchSeatMap'
import { AmadeusFlightOffer } from '@/app/types'
import { useSeatMap } from '@/hooks/useSeatMap'
import { Drawer, Skeleton, Text, Group, Button } from '@mantine/core'
import { useMemo, useState } from 'react'

type Props = {
  opened: boolean
  onClose: () => void
  flightOffer: AmadeusFlightOffer | null
  onConfirm: (seats: string[], price: number) => void
}

export default function SeatMapDrawer({ opened, onClose, flightOffer, onConfirm }: Props) {
  const { seats, loading } = useSeatMap(opened, flightOffer)

  const [selected, setSelected] = useState<string[]>([])

  const { cols, rows } = useMemo(
    () => ({
      rows: Math.max(0, ...seats.map(s => s.row)),
      cols: Math.max(0, ...seats.map(s => s.col))
    }),
    [seats]
  )

  const pricePerSeat = useMemo(() => {
    const seat = seats.find(s => s.price)
    return seat?.price ?? 0
  }, [seats])

  const toggleSeat = (seat: SeatDTO) => {
    if (!seat.available) return
    setSelected(prev =>
      prev.includes(seat.id) ? prev.filter(n => n !== seat.id) : [...prev, seat.id]
    )
  }

  return (
    <Drawer opened={opened} onClose={onClose} title="Seat map" size="lg" position="right">
      {loading && <Skeleton height={400} radius="md" />}
      {!loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 32px)`,
            gridTemplateRows: `repeat(${rows}, 32px)`,
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
                bg={bg}
                onClick={() => toggleSeat(s)}
              >
                {s.id}
              </Text>
            )
          })}
        </div>
      )}

      {!loading && (
        <Group mt="lg" justify="space-between">
          <Text size="sm">Selected: {selected.join(', ') || '—'}</Text>
          <Button
            disabled={!selected.length}
            onClick={() => {
              onConfirm(selected, pricePerSeat * selected.length)
              onClose()
            }}
          >
            Proceed ({selected.length})
          </Button>
        </Group>
      )}
    </Drawer>
  )
}
