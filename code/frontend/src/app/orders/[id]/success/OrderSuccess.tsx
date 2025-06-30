'use client'

import { useConfirmation } from '@/features/orders/hooks'
import { Loader, Container, Stack, Title, Card, Text } from '@mantine/core'

export default function OrderSuccess({ orderId }: { orderId: string }) {
  const { data, isLoading, isError } = useConfirmation(orderId)

  if (isLoading) return <Loader />
  if (isError || !data) return <Text c="red">Couldn’t load confirmation.</Text>

  const order = data.data
  const record = order.associatedRecords[0]

  return (
    <Container size="md" py="lg">
      <Stack>
        <Title order={2}>Thanks – your booking is confirmed!</Title>

        <Card withBorder radius="md">
          <Text fw={700}>PNR / Record Locator:</Text>
          <Text size="xl">{record.reference}</Text>
        </Card>

        <Card withBorder radius="md">
          <Text fw={700}>Itinerary</Text>
          {order.flightOffers[0].itineraries[0].segments.map(s => (
            <Text key={s.id}>
              {s.departure.iataCode}&nbsp;→&nbsp;
              {s.arrival.iataCode}&nbsp; ({new Date(s.departure.at).toLocaleString()} →{' '}
              {new Date(s.arrival.at).toLocaleString()})
            </Text>
          ))}
        </Card>

        <Card withBorder radius="md">
          <Text fw={700}>Total paid</Text>
          <Text size="lg">
            {order.flightOffers[0].price.total}&nbsp;
            {order.flightOffers[0].price.currency}
          </Text>
        </Card>
      </Stack>
    </Container>
  )
}
