import SeatMapSection from '@/components/SeatMapSection'
import { Container } from '@mantine/core'

export default async function OrderPage(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return (
    <Container size="lg" py="lg">
      <SeatMapSection orderId={id} />
    </Container>
  )
}
