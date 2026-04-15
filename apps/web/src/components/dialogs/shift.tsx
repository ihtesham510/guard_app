import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@repo/backend'
import { shiftSchema } from '@repo/backend/schema'
import { useMutation, useQuery } from 'convex/react'
import { convexToZod } from 'convex-helpers/server/zod3'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod/v3'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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

const schema = convexToZod(shiftSchema)

const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
type Day = (typeof ALL_DAYS)[number]

export function ShiftDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (e: boolean) => void }) {
	const [currentStep, setCurrentStep] = useState(1)
	const addShift = useMutation(api.shift.addShift)
	const sites = useQuery(api.sites.getSites)
	const isMobile = useIsMobile()

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			type: 'recurring',
			off_days: [],
			every_day: false,
			excludeDays: [],
			includeDays: [],
			terminated: false,
			pay_rate: 0,
			overTime_multiplyer: 1.5,
			notes: '',
		},
	})

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		try {
			await addShift(data)
			toast.success('Shift added')
		} catch (err) {
			console.error(err)
			toast.error('Error while adding shift')
		}
	}

	const everyDay = form.watch('every_day')

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit, errors => console.log(errors))}>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Shift</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper hideSteps={isMobile} step={currentStep} submitting={form.formState.isSubmitting} onStepChange={setCurrentStep}>
						{/* Step 1 — Shift Basics */}
						<Step>
							<FieldSet>
								<FieldLegend>Shift Details</FieldLegend>
								<FieldDescription>Provide the shift name, type, and the site it belongs to.</FieldDescription>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Shift Name</FormLabel>
											<FormControl>
												<Input placeholder='Morning Shift' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='site'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Site</FormLabel>
											<Select onValueChange={field.onChange} value={field.value ?? ''}>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select a site' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{sites?.map(site => (
														<SelectItem key={site._id} value={site._id}>
															{site.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='type'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Shift Type</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select type' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='recurring'>Recurring</SelectItem>
													<SelectItem value='one_time'>One Time</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='notes'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Notes (optional)</FormLabel>
											<FormControl>
												<Textarea className='resize-none' placeholder='Any instructions or notes...' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 2 — Times */}
						<Step>
							<FieldSet>
								<FieldLegend>Shift Times</FieldLegend>
								<FieldDescription>Set the start and end time for this shift.</FieldDescription>
								<div className='flex items-center justify-between gap-2'>
									<FormField
										control={form.control}
										name='start_time'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Start Time</FormLabel>
												<FormControl>
													<Input type='time' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='end_time'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>End Time</FormLabel>
												<FormControl>
													<Input type='time' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FieldSet>
						</Step>

						{/* Step 3 — Dates */}
						<Step>
							<FieldSet>
								<FieldLegend>Shift Dates</FieldLegend>
								<FieldDescription>Set the start and end date for this shift period.</FieldDescription>
								<div className='flex items-center justify-between gap-2'>
									<FormField
										control={form.control}
										name='start_date'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Start Date</FormLabel>
												<FormControl>
													<Input type='date' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='end_date'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>End Date</FormLabel>
												<FormControl>
													<Input type='date' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FieldSet>
						</Step>

						{/* Step 4 — Off Days */}
						<Step>
							<FieldSet>
								<FieldLegend>Off Days</FieldLegend>
								<FieldDescription>Select which days this shift does not run, or toggle every day.</FieldDescription>
								<FormField
									control={form.control}
									name='every_day'
									render={({ field }) => (
										<FormItem className='flex items-center gap-2 space-y-0'>
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={checked => {
														field.onChange(checked)
														if (checked) form.setValue('off_days', [])
													}}
												/>
											</FormControl>
											<FormLabel className='font-normal'>Run every day (no off days)</FormLabel>
										</FormItem>
									)}
								/>
								{!everyDay && (
									<FormField
										control={form.control}
										name='off_days'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Select Off Days</FormLabel>
												<div className='mt-1 grid grid-cols-2 gap-2'>
													{ALL_DAYS.map(day => (
														<FormItem key={day} className='flex items-center gap-2 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(day)}
																	onCheckedChange={checked => {
																		const current = field.value ?? []
																		field.onChange(checked ? [...current, day] : current.filter((d: Day) => d !== day))
																	}}
																/>
															</FormControl>
															<FormLabel className='font-normal capitalize'>{day}</FormLabel>
														</FormItem>
													))}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</FieldSet>
						</Step>

						{/* Step 5 — Pay */}
						<Step>
							<FieldSet>
								<FieldLegend>Pay Details</FieldLegend>
								<FieldDescription>Set the pay rate and overtime multiplier for this shift.</FieldDescription>
								<FormField
									control={form.control}
									name='pay_rate'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Pay Rate (per hour)</FormLabel>
											<FormControl>
												<Input
													type='number'
													min={0}
													step={0.01}
													placeholder='0.00'
													{...field}
													onChange={e => field.onChange(e.target.valueAsNumber)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='overTime_multiplyer'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Overtime Multiplier</FormLabel>
											<FormControl>
												<Input
													type='number'
													min={1}
													step={0.1}
													placeholder='1.5'
													{...field}
													onChange={e => field.onChange(e.target.valueAsNumber)}
												/>
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
