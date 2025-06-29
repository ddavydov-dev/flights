'use client'

import { Card, Group, Text } from '@mantine/core'
import { Hotel } from '@/app/types'

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card shadow="sm" withBorder>
      <Group>
        <Text fw={700}>{hotel.name}</Text>
        <Text>
          {hotel.price} {hotel.currency}
        </Text>
      </Group>
      <Text size="sm" c="dimmed">
        {hotel.room} • {hotel.board || 'Room only'}
      </Text>
    </Card>
  )
}
