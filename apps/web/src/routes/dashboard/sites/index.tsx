import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/sites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/sites/"!</div>
}
