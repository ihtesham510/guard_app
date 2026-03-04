import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@repo/backend'
import { employeeSchema } from '@repo/backend/schema'
import { useMutation } from 'convex/react'
import { convexToZod } from 'convex-helpers/server/zod3'
import { WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod/v3'
import { Button } from '@/components/ui/button'
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { generateEmployeeCode } from '@/lib/utils'

const schema = convexToZod(employeeSchema)

export function EmployeeDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (e: boolean) => void }) {
	const [currentStep, setCurrentStep] = useState(1)
	const addEmployee = useMutation(api.employee.add_employee)
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			employeeCode: generateEmployeeCode(),
			status: 'active',
			position: 'employee',
			hireDate: new Date(Date.now()).toString(),
		},
	})
	const isMobile = useIsMobile()

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		try {
			await addEmployee(data)
			toast.success('Employee added')
		} catch (err) {
			console.error(err)
			toast.error('Error while adding employee')
		}
	}

	const handleSkipAddress = () => {
		form.setValue('address', undefined)
		setCurrentStep(prev => prev + 2)
	}

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit)}>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Employee</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper hideSteps={isMobile} step={currentStep} submitting={form.formState.isSubmitting} onStepChange={setCurrentStep}>
						{/* Step 1 — Name */}
						<Step>
							<FieldSet>
								<FieldLegend>Employee Name</FieldLegend>
								<FieldDescription>Provide employee first and last name.</FieldDescription>
								<FormField
									control={form.control}
									name='firstName'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='lastName'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 2 — Contact */}
						<Step>
							<FieldSet>
								<FieldLegend>Employee's Contact</FieldLegend>
								<FieldDescription>Provide employee's work or personal phone number and email.</FieldDescription>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type='email' placeholder='name@example.com' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='phone'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<PhoneInput {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 3 — Address lines */}
						<Step>
							<FieldSet>
								<div className='flex items-center justify-between mb-2'>
									<div>
										<FieldLegend>Employee Address</FieldLegend>
										<FieldDescription>Provide employee's address.</FieldDescription>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={handleSkipAddress}
										className='text-muted-foreground hover:text-foreground'
									>
										Skip
									</Button>
								</div>
								<FormField
									control={form.control}
									name='address.addressline_1'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address line 1 (optional)</FormLabel>
											<FormControl>
												<Textarea className='resize-none' {...field} value={field.value ?? undefined} />
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
											<FormLabel>Address line 2 (optional)</FormLabel>
											<FormControl>
												<Textarea className='resize-none' {...field} value={field.value ?? undefined} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 4 — Location */}
						<Step>
							<FieldSet>
								<div className='flex items-center justify-between mb-2'>
									<div>
										<FieldLegend>Employee's Location</FieldLegend>
										<FieldDescription>Provide employee's city, state, postal code and country.</FieldDescription>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={handleSkipAddress}
										className='text-muted-foreground hover:text-foreground'
									>
										Skip
									</Button>
								</div>
								<div className='flex justify-between items-center gap-2'>
									<FormField
										control={form.control}
										name='address.zip'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Zip/Postal Code (optional)</FormLabel>
												<FormControl>
													<Input {...field} value={field.value ?? undefined} />
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
												<FormLabel>City (optional)</FormLabel>
												<FormControl>
													<Input {...field} value={field.value ?? undefined} />
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
												<FormLabel>State (optional)</FormLabel>
												<FormControl>
													<Input {...field} value={field.value ?? undefined} />
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
												<FormLabel>Country (optional)</FormLabel>
												<FormControl>
													<Input {...field} value={field.value ?? undefined} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FieldSet>
						</Step>

						{/* Step 5 — Identification */}
						<Step>
							<FieldSet>
								<FieldLegend>Employee's Identification</FieldLegend>
								<FieldDescription>Generate or enter the employee's code and position.</FieldDescription>
								<FormField
									control={form.control}
									name='employeeCode'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Employee Code</FormLabel>
											<FormControl>
												<InputGroup>
													<InputGroupInput {...field} value={field.value ?? undefined} />
													<InputGroupAddon
														align='inline-end'
														className='cursor-pointer'
														onClick={() => form.setValue('employeeCode', generateEmployeeCode())}
													>
														<Tooltip>
															<TooltipTrigger asChild>
																<WandSparkles />
															</TooltipTrigger>
															<TooltipContent>Generate Employee Code</TooltipContent>
														</Tooltip>
													</InputGroupAddon>
												</InputGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='position'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Employee Position</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select position' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='employee'>Employee</SelectItem>
													<SelectItem value='senior'>Senior</SelectItem>
													<SelectItem value='supervisor'>Supervisor</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>

						{/* Step 6 — Employment Details */}
						<Step>
							<FieldSet>
								<FieldLegend>Employment Details</FieldLegend>
								<FieldDescription>Set the employee's hire date and current status.</FieldDescription>
								<FormField
									control={form.control}
									name='hireDate'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Hire Date</FormLabel>
											<FormControl>
												<Input type='date' {...field} value={field.value ?? undefined} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='status'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Status</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select status' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='active'>Active</SelectItem>
													<SelectItem value='inactive'>Inactive</SelectItem>
													<SelectItem value='terminated'>Terminated</SelectItem>
												</SelectContent>
											</Select>
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
