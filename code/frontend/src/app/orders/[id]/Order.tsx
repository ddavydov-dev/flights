'use client'

import {
  Loader,
  Container,
  Stack,
  Title,
  Card,
  Group,
  Divider,
  Table,
  Text,
  Button
} from '@mantine/core'
import { useOrder, useOrderConfirmation } from '@/features/orders/hooks'
import SeatMapSection from '@/components/SeatMapSection'

export default function Order({ id }: { id: string }) {
  const { data: order, isLoading, isError } = useOrder(id)

  const { mutate: confirm, isPending: confirming } = useOrderConfirmation(id)

  if (!order && isLoading) return <Loader />
  if (isError || !order) return <Text c="red">Couldn’t load order.</Text>

  const { offer, passengers } = order
  const price = offer.price
  const allHaveSeat = passengers.every(p => p.seat)

  return (
    <Container size="xl" py="lg">
      <Stack>
        <Title order={2}>Order #{order.id}</Title>
        <Card withBorder radius="md">
          <Group justify="space-between">
            <Group>
              <Text fw={700}>
                {offer.origin} → {offer.destination}
              </Text>
            </Group>
            <Text>{offer.duration.replace('PT', '').toLowerCase()}</Text>
          </Group>

          <Divider my="sm" />

          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Departure
              </Text>
              <Text>{offer.departureTime}</Text>
            </Stack>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Arrival
              </Text>
              <Text>{offer.arrivalTime}</Text>
            </Stack>
          </Group>
        </Card>

        <SeatMapSection orderId={id} />

        <Card withBorder radius="md">
          <Title order={4} mb="xs">
            Passengers
          </Title>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th>Date&nbsp;of&nbsp;Birth</Table.Th>
                <Table.Th>Seat</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {passengers.map((p, idx: number) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{idx + 1}</Table.Td>
                  <Table.Td>
                    {p.firstName} {p.lastName}
                  </Table.Td>
                  <Table.Td>{p.gender}</Table.Td>
                  <Table.Td>{p.dateOfBirth}</Table.Td>
                  <Table.Td>{p.seat ?? '—'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
        <Card withBorder radius="md">
          <Group justify="space-between">
            <Text fw={700}>Total&nbsp;price</Text>
            <Text fw={700}>€ {price}</Text>
          </Group>
        </Card>

        <Group justify="end" mt="lg">
          <Button loading={confirming} disabled={!allHaveSeat} onClick={() => confirm()}>
            Confirm order
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
