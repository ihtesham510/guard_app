import { api } from '@repo/backend'
import type { EmployeeSchema } from '@repo/backend/schema'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/employees/')({
	component: RouteComponent,
})

function RouteComponent() {
	const employees = useQuery(api.employee.getEmployees)

	// Format date for display
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	// Get status badge variant and custom styles
	const getStatusBadgeProps = (status: EmployeeSchema['status']) => {
		switch (status) {
			case 'active':
				// Success green using chart colors
				return {
					variant: 'default' as const,
					className: 'bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 border-chart-4/30'
				}
			case 'inactive':
				// Warning yellow using chart colors
				return {
					variant: 'secondary' as const,
					className: 'bg-chart-5/20 text-chart-5 hover:bg-chart-5/30 border-chart-5/30'
				}
			case 'terminated':
				// Destructive red
				return {
					variant: 'destructive' as const,
					className: ''
				}
			default:
				return {
					variant: 'outline' as const,
					className: ''
				}
		}
	}

	// Get position badge variant
	const getPositionBadgeProps = (position: EmployeeSchema['position']) => {
		switch (position) {
			case 'supervisor':
				return {
					variant: 'default' as const,
					className: ''
				}
			case 'senior':
				return {
					variant: 'secondary' as const,
					className: ''
				}
			case 'employee':
				return {
					variant: 'outline' as const,
					className: ''
				}
			default:
				return {
					variant: 'outline' as const,
					className: ''
				}
		}
	}

	// Loading state
	if (employees === undefined) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
					<p className='mt-4 text-muted-foreground'>Loading employees...</p>
				</div>
			</div>
		)
	}

	// Empty state
	if (employees && employees.length === 0) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
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
					<h3 className='mt-2 text-sm font-medium text-foreground'>No employees</h3>
					<p className='mt-1 text-sm text-muted-foreground'>Get started by adding your first employee.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-4 sm:px-6 lg:px-8'>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-xl font-semibold text-foreground'>Employees</h1>
					<p className='mt-2 text-sm text-muted-foreground'>A list of all employees including their contact details, position, and status.</p>
				</div>
			</div>
			<div className='mt-8 flex flex-col'>
				<div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
						<div className='overflow-hidden shadow-md ring-1 ring-border md:rounded-lg'>
							<table className='min-w-full divide-y divide-border'>
								<thead className='bg-muted/50'>
									<tr>
										<th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6'>
											Employee
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Contact
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Position
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Hire Date
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Status
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border bg-card'>
									{employees.map((employee: EmployeeSchema & { _id: string }) => {
										const statusProps = getStatusBadgeProps(employee.status)
										const positionProps = getPositionBadgeProps(employee.position)

										return (
											<tr key={employee._id}>
												<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6'>
													<div className='flex items-center'>
														{employee.profile_picture ? (
															<img className='h-10 w-10 rounded-full' src={employee.profile_picture} alt={`${employee.firstName} ${employee.lastName}`} />
														) : (
															<div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
																<span className='text-sm font-medium text-muted-foreground'>
																	{employee.firstName[0]?.toUpperCase()}
																	{employee.lastName[0]?.toUpperCase()}
																</span>
															</div>
														)}
														<div className='ml-4'>
															<div className='text-sm font-medium text-foreground'>
																{employee.firstName} {employee.lastName}
															</div>
															<div className='text-sm text-muted-foreground'>{employee.employeeCode}</div>
														</div>
													</div>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm'>
													<div>
														<div className='text-sm text-foreground'>{employee.email}</div>
														<div className='text-sm text-muted-foreground'>{employee.phone}</div>
													</div>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm'>
													<Badge
														variant={positionProps.variant}
														className={cn(positionProps.className)}
													>
														{employee.position}
													</Badge>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
													{formatDate(employee.hireDate)}
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm'>
													<Badge
														variant={statusProps.variant}
														className={cn(statusProps.className)}
													>
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
