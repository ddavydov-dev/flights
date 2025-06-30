'use client'

import { Button, Divider, Group, Radio, Skeleton, Stack, Text } from '@mantine/core'
import { useSeatSelection } from '@/hooks/useSeatSelection'

export default function SeatMapSection({ orderId }: { orderId: string }) {
  const {
    /* data */
    order,
    passengers,
    seatMap,
    seatMapLoading,
    takenSeatIds,

    /* state */
    activePassenger,
    draft,

    /* actions */
    setActivePassenger,
    toggleSeat,
    saveSeats
  } = useSeatSelection(orderId)

  if (!order) return <Skeleton height={200} mt="md" />

  return (
    <Stack mt="md">
      <Radio.Group value={activePassenger} onChange={setActivePassenger}>
        {passengers.map(p => (
          <Group key={p.id} gap="xs">
            <Radio value={p.id} label={`${p.firstName} ${p.lastName}`} />
            {p.seat && (
              <Text size="sm" c="dimmed">
                {p.seat}
              </Text>
            )}
          </Group>
        ))}
      </Radio.Group>

      <Divider my="sm" />

      {seatMapLoading && <Skeleton height={400} radius="md" />}
      {!seatMapLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(...seatMap.map(s => s.col))}, 32px)`,
            gridTemplateRows: `repeat(${Math.max(...seatMap.map(s => s.row))}, 32px)`,
            gap: 4,
            justifyContent: 'center'
          }}
        >
          {seatMap.map(s => {
            const picked = draft[activePassenger] === s.id
            const blocked = takenSeatIds.has(s.id) && !picked
            const bg = !s.available || blocked ? '#e03131' : picked ? '#1971c2' : '#dee2e6'
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
                onClick={() => !blocked && toggleSeat(s)}
              >
                {s.id}
              </Text>
            )
          })}
        </div>
      )}

      <Group justify="space-between">
        <Button disabled={Object.keys(draft).length !== passengers.length} onClick={saveSeats}>
          Save
        </Button>
      </Group>
    </Stack>
  )
}
