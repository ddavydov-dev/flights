import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { AmadeusFlightOffer } from '../flights/types'
import { fetchSeatMapByOrder } from './api'
import { AmadeusFlightOrder, Order, SeatDTO, SeatAssignment } from './types'
import { useRouter } from 'next/navigation'

export function useConfirmation(orderId: string) {
  return useQuery({
    queryKey: ['confirmation', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}/confirmation`)
      if (!res.ok) throw new Error('No confirmation found')
      return (await res.json()) as { data: AmadeusFlightOrder }
    }
  })
}

export const useCreateOrder = () =>
  useMutation<{ id: string }, Error, { flightOffer: AmadeusFlightOffer; passengers: string }>({
    mutationFn: async payload => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    }
  })

export const useOrder = (id: string) =>
  useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`)

      const { data, error } = (await res.json()) as {
        data: Order
        error?: { code: string; message?: string }
      }

      if (error) {
        throw new Error(error?.message || 'Something went wrong')
      }

      return data
    }
  })

export function useOrderConfirmation(orderId: string) {
  const qc = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST' })
      if (!res.ok) throw new Error('Could not confirm order')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', orderId] })
      router.push(`/orders/${orderId}/success`)
    }
  })
}

export const useSeatMapByOrder = (id: string) =>
  useQuery<SeatDTO[], Error>({
    queryKey: ['seatMap', id],
    enabled: !!id,
    queryFn: async () => fetchSeatMapByOrder(id),
    staleTime: 0
  })

export function useSeatSelection(orderId: string) {
  const { data: order, refetch: refetchOrder } = useOrder(orderId)

  const { data: seatMap = [], isLoading: seatMapLoading } = useSeatMapByOrder(orderId)

  const passengers = useMemo(() => order?.passengers ?? [], [order?.passengers])

  const [activePassenger, setActivePassenger] = useState<string>('')
  useEffect(() => {
    if (!activePassenger && passengers.length > 0) {
      setActivePassenger(passengers[0].id)
    }
  }, [passengers, activePassenger])
  const [draft, setDraft] = useState<Record<string, string>>({})

  const savedSeatIds = useMemo(() => passengers.filter(p => p.seat).map(p => p.seat!), [passengers])

  const takenSeatIds = useMemo(
    () => new Set([...savedSeatIds, ...Object.values(draft)]),
    [savedSeatIds, draft]
  )

  const toggleSeat = useCallback(
    (seat: SeatDTO) => {
      setDraft(prev => {
        const current = prev[activePassenger]
        if (!seat.available && current !== seat.id) {
          return prev
        }

        if (current === seat.id) {
          const others = { ...prev }
          delete others[activePassenger]
          return others
        }

        if (!Object.values(prev).includes(seat.id)) {
          return { ...prev, [activePassenger]: seat.id }
        }

        return prev
      })
    },
    [activePassenger]
  )

  const saveSeats = useCallback(async () => {
    const assignments: SeatAssignment[] = Object.entries(draft).map(([pid, sid]) => {
      const seat = seatMap.find(s => s.id === sid)!
      return { passengerId: pid, seatId: sid, row: seat.row, col: seat.col }
    })

    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignments })
    })

    setDraft({})
    await refetchOrder()
  }, [draft, seatMap, orderId, refetchOrder])

  return {
    order,
    passengers,
    seatMap,
    seatMapLoading,
    savedSeatIds,
    takenSeatIds,
    activePassenger,
    draft,
    setActivePassenger,
    toggleSeat,
    saveSeats
  }
}
