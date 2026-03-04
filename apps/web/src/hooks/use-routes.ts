import { useMatchRoute } from '@tanstack/react-router'
import { Building2, CalendarFold, Clock, Gauge, MessagesSquare, Navigation, SearchIcon, Users } from 'lucide-react'

export function useRoutes() {
	const route = useMatchRoute()
	return [
		{
			label: 'General',
			items: [
				{
					title: 'Search',
					description: 'Search application',
					icon: SearchIcon,
				},
				{
					title: 'Overview',
					description: 'Get an Overview of all things',
					icon: Gauge,
					href: {
						to: '/dashboard',
					},
					isActive: !!route({
						to: '/dashboard',
						fuzzy: false,
					}),
				},
				{
					title: 'Messages',
					description: "See you're messages with employees",
					icon: MessagesSquare,
					href: {
						to: '/dashboard/messages',
					},
					isActive: !!route({
						to: '/dashboard/messages',
						fuzzy: false,
					}),
				},
			],
		},
		{
			label: 'Operations',
			items: [
				{
					title: 'Attendance',
					icon: Clock,
					description: 'See Employees attendance',
					href: {
						to: '/dashboard/attendance',
					},
					isActive: !!route({
						to: '/dashboard/attendance',
						fuzzy: true,
					}),
				},
				{
					title: 'Schedules',
					icon: CalendarFold,
					description: "See you're schedules for employees and sites",
					href: {
						to: '/dashboard/schedules',
					},
					isActive: !!route({
						to: '/dashboard/schedules',
						fuzzy: false,
					}),
				},
				{
					title: 'Employees',
					description: "See and mange you're employees",
					icon: Users,
					href: {
						to: '/dashboard/employees',
					},
					isActive: !!route({
						to: '/dashboard/employees',
						fuzzy: false,
					}),
				},
				{
					title: 'Companies',
					description: "See and mange you're companies",
					icon: Building2,
					href: {
						to: '/dashboard/companies',
					},
					isActive: !!route({
						to: '/dashboard/companies',
						fuzzy: false,
					}),
				},
				{
					title: 'Sites',
					icon: Navigation,
					description: "See and mange you're sites",
					href: {
						to: '/dashboard/sites',
					},
					isActive: !!route({
						to: '/dashboard/sites',
						fuzzy: false,
					}),
				},
			],
		},
	]
}
