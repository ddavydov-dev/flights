'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOrder } from '@/hooks/useOrder'
import { useSeatMapByOrder } from '@/hooks/useSeatMapByOrder'
import type { SeatDTO } from '@/app/types'

interface SeatAssignment {
  passengerId: string
  seatId: string
  row: number
  col: number
}

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
