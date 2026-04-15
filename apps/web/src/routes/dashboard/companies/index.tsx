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
			<div className='flex min-h-100 items-center justify-center'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-primary border-b-2' />
					<p className='mt-4 text-muted-foreground'>Loading companies...</p>
				</div>
			</div>
		)
	}

	if (companies && companies.length === 0) {
		return (
			<div className='flex min-h-100 items-center justify-center'>
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
					<h3 className='mt-2 font-medium text-foreground text-sm'>No companies</h3>
					<p className='mt-1 text-muted-foreground text-sm'>Get started by adding your first company.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-4 sm:px-6 lg:px-8'>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='font-semibold text-foreground text-xl'>Companies</h1>
					<p className='mt-2 text-muted-foreground text-sm'>A list of all companies including their contact details and address.</p>
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
											Company
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Contact
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Address
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											City
										</th>
										<th scope='col' className='px-3 py-3.5 text-left font-semibold text-foreground text-sm'>
											Country
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border bg-card'>
									{companies.map((company: Company & { _id: string }) => (
										<tr key={company._id}>
											<td className='whitespace-nowrap py-4 pr-3 pl-4 text-sm sm:pl-6'>
												<div className='flex items-center'>
													<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted'>
														<span className='font-medium text-muted-foreground text-sm'>{company.name[0]?.toUpperCase()}</span>
													</div>
													<div className='ml-4'>
														<div className='font-medium text-foreground text-sm'>{company.name}</div>
													</div>
												</div>
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-sm'>
												<div className='text-foreground text-sm'>{company.email}</div>
												<div className='text-muted-foreground text-sm'>{company.phone}</div>
											</td>
											<td className='px-3 py-4 text-muted-foreground text-sm'>
												<div>{company.address.addressline_1}</div>
												{company.address.addressline_2 && <div>{company.address.addressline_2}</div>}
												<div>{company.address.zip}</div>
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-muted-foreground text-sm'>
												<div>{company.address.city}</div>
												<div>{company.address.state}</div>
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-muted-foreground text-sm'>{company.address.country}</td>
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
