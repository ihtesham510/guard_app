import { api } from '@repo/backend'
import type { Doc } from '@repo/backend/dataModels'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery } from 'convex-helpers/react/cache'
import { LayoutGrid, List, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TrailCard } from '@/components/ui/trail-card'

export const Route = createFileRoute('/dashboard/sites/')({
	component: RouteComponent,
})

type Site = Doc<'site'>
type ViewMode = 'card' | 'table'

const placeholderImage = 'https://via.placeholder.com/400x240?text=No+Image'

function formatLocation(site: Site): string {
	const parts = []
	if (site.address.state) parts.push(site.address.state)
	if (site.address.country) parts.push(site.address.country)
	return parts.length > 0 ? parts.join(', ') : 'No address'
}

function SiteCardView({ sites }: { sites: Site[] }) {
	const router = useRouter()

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
			{sites.map(site => {
				const firstPicture = site.pictures?.[0]
				const imageUrl = firstPicture?.url ?? undefined

				return (
					<div key={site._id} className='relative min-w-full'>
						<TrailCard
							imageUrl={imageUrl}
							mapImageUrl={imageUrl ?? placeholderImage}
							title={site.name}
							location={formatLocation(site)}
							className='min-w-full'
							onClick={() =>
								router.navigate({
									to: '/dashboard/sites/$siteId',
									params: { siteId: site._id },
								})
							}
						/>
						<div className='absolute top-2 right-2 z-10'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon' className='h-8 w-8 bg-background/80 backdrop-blur-sm'>
										<span className='sr-only'>Open menu</span>
										<MoreHorizontal className='h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem onClick={() => navigator.clipboard.writeText(site._id)}>Copy ID</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											router.navigate({
												to: '/dashboard/sites/edit/$siteId',
												params: { siteId: site._id },
											})
										}
									>
										Edit
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				)
			})}
		</div>
	)
}

function SiteTableView({ sites }: { sites: Site[] }) {
	const router = useRouter()

	return (
		<div className='overflow-hidden shadow-md ring-1 ring-border md:rounded-lg'>
			<table className='min-w-full divide-y divide-border'>
				<thead className='bg-muted/50'>
					<tr>
						<th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6'>
							Site
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
						<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
							Contact
						</th>
						<th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-foreground'>
							Location
						</th>
						<th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
							<span className='sr-only'>Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-border bg-card'>
					{sites.map(site => {
						const firstPicture = site.pictures?.[0]
						const imageUrl = firstPicture?.url ?? undefined

						return (
							<tr
								key={site._id}
								className='cursor-pointer hover:bg-muted/30 transition-colors'
								onClick={() =>
									router.navigate({
										to: '/dashboard/sites/$siteId',
										params: { siteId: site._id },
									})
								}
							>
								<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
									<div className='flex items-center gap-3'>
										<div className='h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0'>
											{imageUrl ? (
												<img src={imageUrl} alt={site.name} className='h-full w-full object-cover' />
											) : (
												<div className='h-full w-full flex items-center justify-center'>
													<span className='text-sm font-medium text-muted-foreground'>{site.name[0]?.toUpperCase()}</span>
												</div>
											)}
										</div>
										<div className='text-sm font-medium text-foreground'>{site.name}</div>
									</div>
								</td>
								<td className='px-3 py-4 text-sm text-muted-foreground'>
									<div>{site.address.addressline_1}</div>
									{site.address.addressline_2 && <div>{site.address.addressline_2}</div>}
									<div>{site.address.zip}</div>
								</td>
								<td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
									<div>{site.address.city}</div>
									<div>{site.address.state}</div>
								</td>
								<td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>{site.address.country}</td>
								<td className='px-3 py-4 text-sm text-muted-foreground'>
									{site.contactInformation ? (
										<>
											<div className='text-foreground'>{site.contactInformation.name}</div>
											<div>{site.contactInformation.email}</div>
											<div>{site.contactInformation.phone}</div>
										</>
									) : (
										<span className='text-muted-foreground/50'>—</span>
									)}
								</td>
								<td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
									{site.location.lat !== '' && site.location.long !== '' ? (
										<div>
											<div>{site.location.lat}</div>
											<div>{site.location.long}</div>
										</div>
									) : (
										<span className='text-muted-foreground/50'>—</span>
									)}
								</td>
								<td
									className='whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6'
									onKeyUp={e => e.stopPropagation()}
									onKeyDown={e => e.stopPropagation()}
									onClick={e => e.stopPropagation()}
								>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant='ghost' size='icon' className='h-8 w-8'>
												<span className='sr-only'>Open menu</span>
												<MoreHorizontal className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem onClick={() => navigator.clipboard.writeText(site._id)}>Copy ID</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													router.navigate({
														to: '/dashboard/sites/edit/$siteId',
														params: { siteId: site._id },
													})
												}
											>
												Edit
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

function RouteComponent() {
	const sites = useQuery(api.sites.getSites)
	const [viewMode, setViewMode] = useState<ViewMode>('card')

	if (sites === undefined) {
		return (
			<div className='flex items-center justify-center min-h-100'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto' />
					<p className='mt-4 text-muted-foreground'>Loading sites...</p>
				</div>
			</div>
		)
	}

	if (sites.length === 0) {
		return (
			<div className='flex items-center justify-center min-h-100'>
				<div className='text-center'>
					<svg className='mx-auto h-12 w-12 text-muted-foreground' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<title>No Sites</title>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
						/>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
					</svg>
					<h3 className='mt-2 text-sm font-medium text-foreground'>No sites</h3>
					<p className='mt-1 text-sm text-muted-foreground'>Get started by adding your first site.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-4 sm:px-6 lg:px-8'>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-xl font-semibold text-foreground'>Sites</h1>
					<p className='mt-2 text-sm text-muted-foreground'>A list of all sites including their location, address, and contact details.</p>
				</div>
				<div className='mt-4 sm:mt-0 sm:ml-4 flex items-center gap-1 rounded-lg border border-border p-1'>
					<Button variant={viewMode === 'card' ? 'secondary' : 'ghost'} size='sm' className='h-8 px-3' onClick={() => setViewMode('card')}>
						<LayoutGrid className='h-4 w-4 mr-1.5' />
						Cards
					</Button>
					<Button
						variant={viewMode === 'table' ? 'secondary' : 'ghost'}
						size='sm'
						className='h-8 px-3'
						onClick={() => setViewMode('table')}
					>
						<List className='h-4 w-4 mr-1.5' />
						Table
					</Button>
				</div>
			</div>

			<div className='mt-8'>
				{viewMode === 'card' ? (
					<SiteCardView sites={sites} />
				) : (
					<div className='-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
							<SiteTableView sites={sites} />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
