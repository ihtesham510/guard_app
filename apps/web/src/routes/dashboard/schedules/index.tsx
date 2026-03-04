import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/schedules/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/schedules/"!</div>
}
