'use client'

import { HotelOfferDTO } from '@/app/types'
import { Card, Group, Text } from '@mantine/core'

export default function HotelCard({ hotel }: { hotel: HotelOfferDTO }) {
  return (
    <Card shadow="sm" withBorder>
      <Group>
        <Text fw={700}>{hotel.hotelName}</Text>
        <Text>
          {hotel.price} {hotel.currency}
        </Text>
      </Group>
      <Text size="sm" c="dimmed">
        {hotel.description}
      </Text>
    </Card>
  )
}
