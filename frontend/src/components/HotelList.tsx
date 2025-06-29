'use client'

import { Stack, Skeleton, Alert, Button } from '@mantine/core'
import HotelCard from '@/components/HotelCard'
import { useHotelOffers } from '@/hooks/useHotelOffers'

export default function HotelList() {
  const { data = [], isLoading, isError, error, refetch } = useHotelOffers()

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
      <Alert mt="md" title="Could not load hotels" color="red">
        {error instanceof Error ? error.message : 'Unknown error'}
        <Button mt="sm" variant="light" onClick={() => refetch()}>
          Try again
        </Button>
      </Alert>
    )
  }

  if (data.length === 0) {
    return (
      <Alert
        mt="md"
        // icon={<IconInfoCircle size={16} />}
        title="No hotels found"
        color="blue"
      >
        We couldn’t find any offers for the chosen dates and destination. Try adjusting your search
        or check back later.
      </Alert>
    )
  }

  return (
    <Stack mt="md">
      {data.map(h => (
        <HotelCard key={h.offerId} hotel={h} />
      ))}
    </Stack>
  )
}
