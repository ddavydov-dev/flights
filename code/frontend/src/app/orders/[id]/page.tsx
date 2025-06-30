import Order from '@/components/Order'

export default async function OrderPage(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  return <Order id={id} />
}
