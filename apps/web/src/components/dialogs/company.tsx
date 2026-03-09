import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@repo/backend'
import { companySchema } from '@repo/backend/schema'
import { useMutation } from 'convex/react'
import { convexToZod } from 'convex-helpers/server/zod3'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod/v3'
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogForm,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog'
import Stepper, { Step } from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'

const schema = convexToZod(companySchema.omit('userId'))

export function CompanyDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (e: boolean) => void }) {
	const [currentStep, setCurrentStep] = useState(1)
	const addCompany = useMutation(api.company.addCompany)
	const isMobile = useIsMobile()

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {},
	})

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		try {
			await addCompany(data)
			toast.success('Company added')
			onOpenChange?.(false)
		} catch (err) {
			console.error(err)
			toast.error('Error while adding company')
		}
	}

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit, errors => console.log(errors))}>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Company</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper hideSteps={isMobile} step={currentStep} submitting={form.formState.isSubmitting} onStepChange={setCurrentStep}>
						{/* Step 1 — Company Info */}
						<Step>
							<FieldSet>
								<FieldLegend>Company Information</FieldLegend>
								<FieldDescription>Provide the company's name and contact details.</FieldDescription>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Company Name</FormLabel>
											<FormControl>
												<Input placeholder='Acme Corp' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type='email' placeholder='contact@example.com' {...field} />
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

						{/* Step 2 — Address Lines */}
						<Step>
							<FieldSet>
								<FieldLegend>Company Address</FieldLegend>
								<FieldDescription>Provide the company's street address.</FieldDescription>
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
								<FieldLegend>Company Location</FieldLegend>
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
					</Stepper>
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
