import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/companies/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/companies/"!</div>
}
