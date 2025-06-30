'use client'

import { Stack, Skeleton, Alert, Button } from '@mantine/core'
import FlightCard from '@/app/flights/FlightCard'
import { useFlightOffers } from '@/features/flights/hooks'

export default function FlightList() {
  const { data: offers, isLoading, isError, error, refetch } = useFlightOffers()

  if (isLoading)
    return (
      <Stack mt="md">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} height={80} radius="md" />
        ))}
      </Stack>
    )

  if (isError) {
    return (
      <Alert mt="md" title="Could not load flights" color="red">
        {error instanceof Error ? error.message : 'Unknown error'}
        <Button mt="sm" variant="light" onClick={() => refetch()}>
          Try again
        </Button>
      </Alert>
    )
  }

  if (!offers || offers.length === 0) {
    return (
      <Alert mt="md" title="No flights found" color="blue">
        We couldn’t find any offers for the selected route and dates. Try adjusting your search.
      </Alert>
    )
  }

  return (
    <Stack mt="md">
      {offers.map(offer => (
        <FlightCard key={offer.id} {...offer} />
      ))}
    </Stack>
  )
}
