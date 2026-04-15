import { api } from '@repo/backend'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex-helpers/react/cache'
import { Calendar, CalendarControlls, CalendarHeader, CalendarModel, CalendarTitle } from '@/components/ui/event-calendar'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/dashboard/schedules/')({
	component: RouteComponent,
	loader: async ({ context: { convex } }) => {
		await convex.query(api.shift.getShifts)
	},
	pendingComponent: () => (
		<div className='flex h-screen w-full items-center justify-center'>
			<Spinner className='size-8' />
		</div>
	),
})

function RouteComponent() {
	const shifts = useQuery(api.shift.getShifts)
	if (shifts) {
		return (
			<div>
				<Calendar>
					<CalendarHeader>
						<CalendarTitle />
						<CalendarControlls />
					</CalendarHeader>
					<CalendarModel />
				</Calendar>
			</div>
		)
	}
}
