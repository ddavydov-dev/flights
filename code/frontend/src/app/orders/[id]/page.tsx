import Order from '@/app/orders/[id]/Order'

export default async function OrderPage(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  return <Order id={id} />
}
