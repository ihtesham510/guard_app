import { createFileRoute } from '@tanstack/react-router'
import { EmployeeDialog } from '@/components/dialogs/employee'

export const Route = createFileRoute('/dashboard/employees/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<EmployeeDialog open />
		</div>
	)
}
