import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@repo/backend'
import { type LocationSchema, siteSchema } from '@repo/backend/schema'
import { type Coordinates, getPolygonOverview } from '@repo/shared'
import { useMutation, useQuery } from 'convex/react'
import { convexToZod } from 'convex-helpers/server/zod3'
import { useState } from 'react'
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
import { useIsMobile } from '@/hooks/use-mobile'

const schema = convexToZod(siteSchema.omit('userId', 'location'))

export function SiteDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (e: boolean) => void }) {
	const [currentStep, setCurrentStep] = useState(1)
	const [location, setLocation] = useState<LocationSchema>()
	const addSite = useMutation(api.sites.addSite)
	const companies = useQuery(api.company.getCompanies)
	const isMobile = useIsMobile()

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			pictures: [],
		},
	})

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		if (location) {
			try {
				await addSite({ ...data, location })
				toast.success('Site added')
			} catch (err) {
				console.error(err)
				toast.error('Error while adding site')
			}
		}
	}

	const handleSkipContact = () => {
		form.setValue('contactInformation', undefined)
		setCurrentStep(prev => prev + 2)
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
								<div className='flex justify-between items-center gap-2'>
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
								<div className='flex justify-between items-center gap-2'>
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
								<div className='w-full h-75 relative'>
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
								<div className='flex items-center justify-between mb-2'>
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
					</Stepper>
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
