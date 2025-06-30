import { randomUUID } from 'crypto'
import type {
  AmadeusFlightOrder,
  FlightOfferDTO,
  Order,
  Passenger,
  SeatAssignmentDTO,
  SeatDTO
} from '../types'

const orders = new Map<string, Order>()

const FIRST_NAMES_M = ['John', 'Max', 'Liam', 'Mika', 'Arto']
const FIRST_NAMES_F = ['Anna', 'Mary', 'Emma', 'Linda', 'Sofia']
const LAST_NAMES = ['Doe', 'Smith', 'Johnson', 'Korhonen', 'Virtanen']

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPassenger(id: number): Passenger {
  const gender = Math.random() < 0.5 ? 'MALE' : 'FEMALE'
  const first = gender === 'MALE' ? randomFrom(FIRST_NAMES_M) : randomFrom(FIRST_NAMES_F)
  const last = randomFrom(LAST_NAMES)
  const year = 1950 + Math.floor(Math.random() * 50)
  const month = 1 + Math.floor(Math.random() * 12)
  const day = 1 + Math.floor(Math.random() * 28)
  return {
    id: `P${id}`,
    firstName: first,
    lastName: last,
    gender,
    dateOfBirth: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
}

export function createOrder(offer: FlightOfferDTO, passengersAmount: number): Order {
  const id = randomUUID()
  const passengers = Array.from({ length: passengersAmount }, (_, i) => randomPassenger(i + 1))

  const order: Order = { id, offer, passengers, seats: [], confirmation: null }
  orders.set(id, order)
  return order
}

export function getOrder(id: string): Order | null {
  return orders.get(id) ?? null
}

export function updateOrderSeats(id: string, assignments: SeatAssignmentDTO[]): Order | null {
  const order = orders.get(id)
  if (!order) return null

  const paxIds = new Set(order.passengers.map(p => p.id))
  const uniquePassengers = new Set(assignments.map(a => a.passengerId))
  if (
    uniquePassengers.size !== assignments.length ||
    ![...uniquePassengers].every(id => paxIds.has(id))
  ) {
    throw new Error('ASSIGNMENT_ERROR: invalid passenger IDs')
  }

  const seatIds = assignments.map(a => a.seatId)
  if (new Set(seatIds).size !== seatIds.length) {
    throw new Error('ASSIGNMENT_ERROR: duplicate seat IDs')
  }

  order.passengers.forEach(p => delete p.seat)
  order.seats = []

  assignments.forEach(a => {
    order.seats.push({
      id: a.seatId,
      row: a.row,
      col: a.col,
      available: false
    })
    const pax = order.passengers.find(p => p.id === a.passengerId)
    if (pax) pax.seat = a.seatId
  })

  return order
}

export function markOrderConfirmed(id: string, confirmation: AmadeusFlightOrder) {
  const order = orders.get(id)
  if (order) order.confirmation = confirmation
}
