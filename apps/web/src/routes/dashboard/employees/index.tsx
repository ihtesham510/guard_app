import { api } from '@repo/backend'
import type { Doc } from '@repo/backend/dataModels'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex-helpers/react/cache'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Employee = Doc<'employee'>

export const Route = createFileRoute('/dashboard/employees/')({
	component: RouteComponent,
})

function RouteComponent() {
	const employees = useQuery(api.employee.getEmployees)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const getStatusBadgeProps = (status: Employee['status']) => {
		switch (status) {
			case 'active':
				return {
					variant: 'default' as const,
					className: 'bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 border-chart-4/30',
				}
			case 'inactive':
				return {
					variant: 'secondary' as const,
					className: 'bg-chart-5/20 text-chart-5 hover:bg-chart-5/30 border-chart-5/30',
				}
			case 'terminated':
				return {
					variant: 'destructive' as const,
					className: '',
				}
			default:
				return {
					variant: 'outline' as const,
					className: '',
				}
		}
	}

	const getPositionBadgeProps = (position: Employee['position']) => {
		switch (position) {
			case 'supervisor':
				return {
					variant: 'default' as const,
					className: '',
				}
			case 'senior':
				return {
					variant: 'secondary' as const,
					className: '',
				}
			case 'employee':
				return {
					variant: 'outline' as const,
					className: '',
				}
			default:
				return {
					variant: 'outline' as const,
					className: '',
				}
		}
	}

	if (employees === undefined) {
		return (
			<div className='flex min-h-100 items-center justify-center'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-primary border-b-2' />
					<p className='mt-4 text-muted-foreground'>Loading employees...</p>
				</div>
			</div>
		)
	}

	if (employees && employees.length === 0) {
		return (
			<div className='flex min-h-100 items-center justify-center'>
				<div className='text-center'>
					<svg className='mx-auto h-12 w-12 text-muted-foreground' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<title>no Employee</title>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
						/>
					</svg>
					<h3 className='mt-2 font-medium text-foreground text-sm'>No employees</h3>
					<p className='mt-1 text-muted-foreground text-sm'>Get started by adding your first employee.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-4 sm:px-6 lg:px-8'>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='font-semibold text-foreground text-xl'>Employees</h1>
					<p className='mt-2 text-muted-foreground text-sm'>
						A list of all employees including their contact details, position, and status.
					</p>
				</div>
			</div>
			<div className='mt-8 flex flex-col'>
				<div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
						<div className='overflow-hidden shadow-md ring-1 ring-border md:rounded-lg'>
							<table className='min-w-full divide-y divide-border'>
								<thead className='bg-muted/50'>
									<tr>
										<th scope='col' className='py-3.5 pr-3 pl-4 text-left font-semibold text-foreground text-sm sm:pl-6'>
											Employee
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Contact
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Position
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Hire Date
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Status
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border bg-card'>
									{employees.map((employee: Employee & { _id: string }) => {
										const statusProps = getStatusBadgeProps(employee.status)
										const positionProps = getPositionBadgeProps(employee.position)

										return (
											<tr key={employee._id}>
												<td className='whitespace-nowrap py-4 pr-3 pl-4 font-medium text-foreground text-sm sm:pl-6'>
													<div className='flex items-center'>
														{employee.profile_picture ? (
															<img
																className='h-10 w-10 rounded-full'
																src={employee.profile_picture}
																alt={`${employee.firstName} ${employee.lastName}`}
															/>
														) : (
															<div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
																<span className='font-medium text-muted-foreground text-sm'>
																	{employee.firstName[0]?.toUpperCase()}
																	{employee.lastName[0]?.toUpperCase()}
																</span>
															</div>
														)}
														<div className='ml-4'>
															<div className='font-medium text-foreground text-sm'>
																{employee.firstName} {employee.lastName}
															</div>
															<div className='text-muted-foreground text-sm'>{employee.employeeCode}</div>
														</div>
													</div>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm'>
													<div>
														<div className='text-foreground text-sm'>{employee.email}</div>
														<div className='text-muted-foreground text-sm'>{employee.phone}</div>
													</div>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm'>
													<Badge variant={positionProps.variant} className={cn(positionProps.className)}>
														{employee.position}
													</Badge>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-muted-foreground text-sm'>{formatDate(employee.hireDate)}</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm'>
													<Badge variant={statusProps.variant} className={cn(statusProps.className)}>
														{employee.status}
													</Badge>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
