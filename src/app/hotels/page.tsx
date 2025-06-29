'use client'

import { Container, Divider } from '@mantine/core'
import HotelList from '@/components/HotelList'
import Tabs from '@/components/Tabs'
import HotelsSearchForm from '@/components/HotelsSearchForm'

export default function HotelsPage() {
  return (
    <Container size="lg" py="lg">
      <Tabs />

      <HotelsSearchForm />

      <Divider my={40} />

      <HotelList />
    </Container>
  )
}
