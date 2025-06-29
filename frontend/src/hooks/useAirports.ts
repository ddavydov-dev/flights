import { fetchAirports } from '@/api/fetchAirports'
import { useDebouncedValue } from '@mantine/hooks'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useAirports(query: string, enabled: boolean) {
  const [debounced] = useDebouncedValue(query.trim(), 300)

  return useQuery({
    queryKey: ['airports', debounced],
    enabled: true,
    // enabled: enabled && debounced.length >= 1,
    retry: 1,
    queryFn: () => fetchAirports(debounced),
    placeholderData: keepPreviousData
  })
}
