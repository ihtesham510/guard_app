import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/sites/edit/$siteId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/sites/edit/$siteId"!</div>
}
