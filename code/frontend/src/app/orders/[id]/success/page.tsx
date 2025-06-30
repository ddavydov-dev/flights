import OrderSuccess from '@/app/orders/[id]/success/OrderSuccess'

export default async function SuccessPage(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  return <OrderSuccess orderId={id} />
}
