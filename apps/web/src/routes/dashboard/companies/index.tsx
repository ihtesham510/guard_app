import { api } from '@repo/backend'
import type { Doc } from '@repo/backend/dataModels'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex-helpers/react/cache'

type Company = Doc<'company'>

export const Route = createFileRoute('/dashboard/companies/')({
	component: RouteComponent,
})

function RouteComponent() {
	const companies = useQuery(api.company.getCompanies)

	if (companies === undefined) {
		return (
			<div className='flex items-center justify-center min-h-100'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto' />
					<p className='mt-4 text-muted-foreground'>Loading companies...</p>
				</div>
			</div>
		)
	}

	if (companies && companies.length === 0) {
		return (
			<div className='flex items-center justify-center min-h-100'>
				<div className='text-center'>
					<svg className='mx-auto h-12 w-12 text-muted-foreground' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<title>No Companies</title>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
						/>
					</svg>
					<h3 className='mt-2 text-sm font-medium text-foreground'>No companies</h3>
					<p className='mt-1 text-sm text-muted-foreground'>Get started by adding your first company.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-4 sm:px-6 lg:px-8'>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-xl font-semibold text-foreground'>Companies</h1>
					<p className='mt-2 text-sm text-muted-foreground'>A list of all companies including their contact details and address.</p>
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
											Company
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Contact
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Address
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											City
										</th>
										<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
											Country
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border bg-card'>
									{companies.map((company: Company & { _id: string }) => (
										<tr key={company._id}>
											<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
												<div className='flex items-center'>
													<div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0'>
														<span className='text-sm font-medium text-muted-foreground'>{company.name[0]?.toUpperCase()}</span>
													</div>
													<div className='ml-4'>
														<div className='text-sm font-medium text-foreground'>{company.name}</div>
													</div>
												</div>
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-sm'>
												<div className='text-sm text-foreground'>{company.email}</div>
												<div className='text-sm text-muted-foreground'>{company.phone}</div>
											</td>
											<td className='px-3 py-4 text-sm text-muted-foreground'>
												<div>{company.address.addressline_1}</div>
												{company.address.addressline_2 && <div>{company.address.addressline_2}</div>}
												<div>{company.address.zip}</div>
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
												<div>{company.address.city}</div>
												<div>{company.address.state}</div>
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>{company.address.country}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
