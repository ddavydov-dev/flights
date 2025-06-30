'use client'

import { Container, Divider } from '@mantine/core'
import HotelList from '@/app/hotels/HotelList'
import Tabs from '@/components/Tabs'
import HotelsSearchForm from '@/app/hotels/HotelsSearchForm'
import { Suspense } from 'react'

export default function HotelsPage() {
  return (
    <Container size="xl" py="lg">
      <Suspense>
        <Tabs />

        <HotelsSearchForm />

        <Divider my={40} />

        <HotelList />
      </Suspense>
    </Container>
  )
}
