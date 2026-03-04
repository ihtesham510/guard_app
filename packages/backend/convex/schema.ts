import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

export const addressSchema = v.object({
	addressline_1: v.string(),
	addressline_2: v.optional(v.string()),
	state: v.string(),
	city: v.string(),
	zip: v.string(),
	country: v.string(),
})

export const fileSchema = v.object({
	url: v.string(),
	storage_id: v.id('_storage'),
})

export const employeeSchema = v.object({
	userId: v.string(),
	profile_picture: v.optional(v.string()),
	employeeCode: v.string(),
	firstName: v.string(),
	lastName: v.string(),
	email: v.string(),
	phone: v.string(),
	address: v.optional(addressSchema),
	position: v.union(v.literal('supervisor'), v.literal('employee'), v.literal('senior')),
	hireDate: v.string(),
	status: v.union(v.literal('active'), v.literal('inactive'), v.literal('terminated')),
})
export type EmployeeSchema = Infer<typeof employeeSchema>

export const shiftSchema = v.object({
	site: v.id('site'),
	name: v.string(),
	type: v.union(v.literal('recurring'), v.literal('one_time')),
	notes: v.string(),
	start_time: v.string(),
	end_time: v.string(),
	start_date: v.string(),
	end_date: v.string(),
	off_days: v.array(
		v.union(
			v.literal('sunday'),
			v.literal('monday'),
			v.literal('tuesday'),
			v.literal('wednesday'),
			v.literal('thursday'),
			v.literal('friday'),
			v.literal('saturday'),
		),
	),
	every_day: v.boolean(),
	excludeDays: v.array(v.object({ day: v.string(), reason: v.optional(v.string()) })),
	includeDays: v.array(v.object({ day: v.string(), reason: v.optional(v.string()) })),
	pay_rate: v.float64(),
	terminated: v.boolean(),
	overTime_multiplyer: v.float64(),
})
export type ShiftSchema = Infer<typeof shiftSchema>

export const siteSchema = v.object({
	name: v.string(),
	userId: v.string(),
	company: v.optional(v.id('company')),
	pictures: v.array(fileSchema),
	address: addressSchema,
	location: v.object({
		long: v.string(),
		lat: v.string(),
	}),
	contactInformation: v.optional(
		v.object({
			name: v.string(),
			phone: v.string(),
			email: v.string(),
		}),
	),
})
export type SiteSchema = Infer<typeof shiftSchema>

export const timeEntrySchema = v.object({
	shift: v.id('site'),
	employee: v.id('employee'),
	start_time: v.string(),
	end_time: v.string(),
	break_start: v.string(),
	break_end: v.string(),
	break_time: v.string(),
	hours: v.float64(),
})
export type TimeEntrySchema = Infer<typeof timeEntrySchema>

const leaveRequestSchema = v.object({
	employee: v.id('employee'),
	reason: v.string(),
	day: v.union(
		v.object({
			start_date: v.string(),
			end_date: v.string(),
		}),
		v.string(),
	),
	status: v.union(v.literal('approved'), v.literal('rejected'), v.literal('cancelled'), v.literal('pending')),
})
export type LeaveRequestSchema = Infer<typeof leaveRequestSchema>

export const companySchema = v.object({
	name: v.string(),
	email: v.string(),
	phone: v.string(),
	address: addressSchema,
	userId: v.string(),
})
export type CompanySchema = Infer<typeof companySchema>

export const shiftAssignmentSchema = v.object({
	employee: v.id('employee'),
	shift: v.id('shift'),
	assign_date: v.string(),
})
export type ShiftAssignmentSchema = Infer<typeof shiftAssignmentSchema>

export const shiftAssignmentRequestSchema = v.object({
	employee: v.id('employee'),
	shift: v.id('shift'),
	status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('rejected'), v.literal('cancelled')),
	rejectionReason: v.optional(v.string()),
})
export type ShiftAssignmentRequestSchema = Infer<typeof shiftAssignmentRequestSchema>

export default defineSchema({
	company: defineTable(companySchema).index('by_userid', ['userId']),
	site: defineTable(siteSchema).index('by_company', ['company']).index('by_userid', ['userId']),
	employee: defineTable(employeeSchema).index('by_userid', ['userId']).index('by_email', ['email']).index('by_phone', ['phone']),
	shift: defineTable(shiftSchema).index('by_site', ['site']),
	shift_assignment: defineTable(shiftAssignmentSchema).index('by_employee', ['employee']).index('by_shift', ['shift']),
	shift_assignment_request: defineTable(shiftAssignmentRequestSchema).index('by_employee', ['employee']),
	time_entry: defineTable(timeEntrySchema).index('by_shift', ['shift']).index('by_employee', ['employee']),
	leave_request: defineTable(leaveRequestSchema).index('by_employee', ['employee']),
})
