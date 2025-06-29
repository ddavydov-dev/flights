'use client'

import SearchForm from '@/components/FlightsSearchForm'
import { Container, Stack } from '@mantine/core'

export default function SearchPage() {
  return (
    <Container size="xl" py="xl" h="100vh">
      <Stack justify="center" align="center" h="100%">
        <SearchForm />
      </Stack>
    </Container>
  )
}
