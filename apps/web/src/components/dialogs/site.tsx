import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@repo/backend'
import { type LocationSchema, siteSchema } from '@repo/backend/schema'
import { type Coordinates, getPolygonOverview } from '@repo/shared'
import { useMutation, useQuery } from 'convex/react'
import { convexToZod } from 'convex-helpers/server/zod3'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod/v3'
import { MapAreaSelector } from '@/components/map/area-selector'
import { Button } from '@/components/ui/button'
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Map as ShadcnMap } from '@/components/ui/map'
import { PhoneInput } from '@/components/ui/phone-input'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogForm,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Stepper, { Step } from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useIsMobile } from '@/hooks/use-mobile'

const schema = convexToZod(siteSchema.omit('userId', 'location'))

export function SiteDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (e: boolean) => void }) {
	const [currentStep, setCurrentStep] = useState(1)
	const [location, setLocation] = useState<LocationSchema>()
	const [pendingPictures, setPendingPictures] = useState<File[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const addSite = useMutation(api.sites.addSite)
	const companies = useQuery(api.company.getCompanies)
	const isMobile = useIsMobile()
	const uploadFile = useFileUpload()

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			pictures: [],
		},
	})

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		if (!location) {
			toast.error('Please select a location on the map')
			return
		}

		try {
			const uploadedPictures = await Promise.all(
				pendingPictures.map(async file => {
					const { url, storageId } = await uploadFile(file)
					return { url, storage_id: storageId }
				}),
			)
			await addSite({ ...data, location, pictures: uploadedPictures })
			form.reset()
			setLocation(undefined)
			setPendingPictures([])
			toast.success('Site added')
			onOpenChange?.(false)
		} catch (err) {
			console.error(err)
			toast.error('Error while adding site')
		}
	}

	const handleSkipContact = () => {
		form.setValue('contactInformation', undefined)
		setCurrentStep(prev => prev + 2)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? [])
		if (!files.length) return
		setPendingPictures(prev => [...prev, ...files])
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const removePicture = (index: number) => {
		setPendingPictures(prev => prev.filter((_, i) => i !== index))
	}

	const overViewCoord =
		location && 'polygon' in location ? getPolygonOverview(location.polygon as Coordinates[]).coordinates : [-74.006, 40.7128]

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit, errors => console.log(errors))}>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Site</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper hideSteps={isMobile} step={currentStep} submitting={form.formState.isSubmitting} onStepChange={setCurrentStep}>
						{/* Step 1 — Site Name & Company */}
						<Step>
							<FieldSet>
								<FieldLegend>Site Information</FieldLegend>
								<FieldDescription>Provide the site name and optionally link it to a company.</FieldDescription>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Site Name</FormLabel>
											<FormControl>
												<Input placeholder='Main Warehouse' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='company'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Company (optional)</FormLabel>
											<Select onValueChange={field.onChange} value={field.value ?? ''}>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select a company' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{companies?.map(company => (
														<SelectItem key={company._id} value={company._id}>
															{company.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 2 — Address Lines */}
						<Step>
							<FieldSet>
								<FieldLegend>Site Address</FieldLegend>
								<FieldDescription>Provide the site's street address.</FieldDescription>
								<FormField
									control={form.control}
									name='address.addressline_1'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address Line 1</FormLabel>
											<FormControl>
												<Textarea className='resize-none' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='address.addressline_2'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address Line 2 (optional)</FormLabel>
											<FormControl>
												<Textarea className='resize-none' {...field} value={field.value ?? undefined} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 3 — Location */}
						<Step>
							<FieldSet>
								<FieldLegend>Site Location</FieldLegend>
								<FieldDescription>Provide the city, state, postal code and country.</FieldDescription>
								<div className='flex items-center justify-between gap-2'>
									<FormField
										control={form.control}
										name='address.zip'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Zip / Postal Code</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='address.city'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>City</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='flex items-center justify-between gap-2'>
									<FormField
										control={form.control}
										name='address.state'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>State</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='address.country'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FieldSet>
						</Step>

						{/* Step 4 — GPS Coordinates */}
						<Step>
							<FieldSet>
								<FieldLegend>GPS Coordinates</FieldLegend>
								<FieldDescription>Provide the site's latitude and longitude for map pinning.</FieldDescription>
								<div className='relative h-75 w-full'>
									<ShadcnMap
										center={[overViewCoord[0], overViewCoord[1]]}
										zoom={location && 'polygon' in location ? getPolygonOverview(location.polygon as Coordinates[]).zoom : 12}
									>
										<MapAreaSelector value={location} onSelect={e => setLocation(e)} />
									</ShadcnMap>
								</div>
							</FieldSet>
						</Step>

						{/* Step 5 — Contact Information */}
						<Step>
							<FieldSet>
								<div className='mb-2 flex items-center justify-between'>
									<div>
										<FieldLegend>Site Contact</FieldLegend>
										<FieldDescription>Provide a contact person for this site.</FieldDescription>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={handleSkipContact}
										className='text-muted-foreground hover:text-foreground'
									>
										Skip
									</Button>
								</div>
								<FormField
									control={form.control}
									name='contactInformation.name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contact Name</FormLabel>
											<FormControl>
												<Input placeholder='Jane Doe' {...field} value={field.value ?? undefined} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='contactInformation.email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contact Email</FormLabel>
											<FormControl>
												<Input type='email' placeholder='jane@example.com' {...field} value={field.value ?? undefined} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='contactInformation.phone'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contact Phone</FormLabel>
											<FormControl>
												<PhoneInput {...field} value={field.value ?? undefined} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 6 — Pictures */}
						<Step>
							<FieldSet>
								<div className='mb-2 flex items-center justify-between'>
									<div>
										<FieldLegend>Site Pictures</FieldLegend>
										<FieldDescription>
											Upload photos of the site (optional). Pictures are uploaded when you submit the form.
										</FieldDescription>
									</div>
									{/* Hidden native file input — triggered by the button below */}
									<input ref={fileInputRef} type='file' accept='image/*' multiple className='hidden' onChange={handleFileChange} />
									<Button type='button' variant='outline' size='sm' onClick={() => fileInputRef.current?.click()}>
										Add Photos
									</Button>
								</div>

								{pendingPictures.length === 0 ? (
									<button
										type='button'
										className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-muted-foreground transition-colors hover:bg-muted/40'
										onClick={() => fileInputRef.current?.click()}
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-8 w-8 opacity-40'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											strokeWidth={1.5}
										>
											<title>upload icon</title>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h.008v.008H3V9.75zm0 4.5h.008v.008H3v-.008zm18-4.5h.008v.008H21V9.75zm0 4.5h.008v.008H21v-.008zM12 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
											/>
										</svg>
										<span className='text-sm'>Click to add photos</span>
									</button>
								) : (
									<div className='grid grid-cols-3 gap-2'>
										{pendingPictures.map((file, index) => {
											const objectUrl = URL.createObjectURL(file)
											return (
												<div key={index} className='group relative aspect-square overflow-hidden rounded-md border'>
													<img
														src={objectUrl}
														alt={file.name}
														className='h-full w-full object-cover'
														// Revoke the object URL once the image has loaded to free memory
														onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
													/>
													<button
														type='button'
														onClick={() => removePicture(index)}
														className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100'
														aria-label='Remove picture'
													>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3' viewBox='0 0 20 20' fill='currentColor'>
															<title>upload icon</title>
															<path
																fillRule='evenodd'
																d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
																clipRule='evenodd'
															/>
														</svg>
													</button>
													<div className='absolute right-0 bottom-0 left-0 truncate bg-black/40 px-1 py-0.5 text-[10px] text-white'>
														{file.name}
													</div>
												</div>
											)
										})}
										{/* Add-more tile */}
										<button
											type='button'
											onClick={() => fileInputRef.current?.click()}
											className='flex aspect-square items-center justify-center rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:bg-muted/40'
											aria-label='Add more photos'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-6 w-6 opacity-50'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={2}
											>
												<title>upload icon</title>
												<path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
											</svg>
										</button>
									</div>
								)}
							</FieldSet>
						</Step>
					</Stepper>
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
