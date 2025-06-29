'use client'

import { Container, Divider } from '@mantine/core'
import FlightsSearchForm from '@/components/FlightsSearchForm'
import Tabs from '@/components/Tabs'
import FlightList from '@/components/FlightList'

export default function FlightsPage() {
  return (
    <Container size="lg" py="lg">
      <Tabs />

      <FlightsSearchForm />

      <Divider my={40} />

      <FlightList />
    </Container>
  )
}
