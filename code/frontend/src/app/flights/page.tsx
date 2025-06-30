'use client'

import { Container, Divider } from '@mantine/core'
import FlightsSearchForm from '@/components/FlightsSearchForm'
import Tabs from '@/components/Tabs'
import FlightList from '@/components/FlightList'
import { Suspense } from 'react'
import FlightSort from '@/components/FlightSort'

export default function FlightsPage() {
  return (
    <Container size="xl" py="lg">
      <Suspense>
        <Tabs />

        <FlightsSearchForm />

        <Divider my={40} />

        <FlightSort />
        <FlightList />
      </Suspense>
    </Container>
  )
}
