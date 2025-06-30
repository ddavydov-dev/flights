import { useFlightsSearchForm } from '@/hooks/useFlightsSearchForm'
import { useFlightsSearchParams } from '@/hooks/useFlightsSearchParams'
import { Group, SegmentedControl, Select } from '@mantine/core'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export default function FlightSort() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { sortBy, sortOrder = 'asc' } = useFlightsSearchParams()
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const p = new URLSearchParams(searchParams.toString())

      if (value === null || value === '') {
        p.delete(key)
      } else {
        p.set(key, value)
      }

      router.replace(`${pathname}?${p.toString()}`)
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    if (!sortBy) updateParam('sort', 'price')
    if (!sortOrder) updateParam('order', 'asc')
  }, [])

  return (
    <Group align="end" justify="flex-start">
      <Select
        label="Sort by"
        data={[
          { value: 'price', label: 'Price' },
          { value: 'duration', label: 'Duration' }
        ]}
        value={sortBy}
        onChange={val => updateParam('sort', val)}
      />
      <SegmentedControl
        value={sortOrder}
        onChange={val => updateParam('order', val)}
        data={[
          {
            label: 'Up',
            value: 'asc'
          },
          {
            label: 'Down',
            value: 'desc'
          }
        ]}
      />
    </Group>
  )
}
