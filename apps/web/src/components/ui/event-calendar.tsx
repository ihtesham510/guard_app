import {
	addMonths,
	addWeeks,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from 'date-fns'
import { CalendarIcon, ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import type React from 'react'
import { createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useContext, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Calendar as CalendarComp } from '@/components/ui/calendar'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type View = 'weekly' | 'monthly'

type CalendarCell = { date: Date; isCurrentMonth: boolean }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarContext {
	date: Date
	setDate: Dispatch<SetStateAction<Date>>
	view: View
	setView: Dispatch<SetStateAction<View>>
	mode?: View
}

const context = createContext<CalendarContext | null>(null)
interface CalendarProps extends PropsWithChildren {
	defaultView?: View
	defaultDate?: Date
	mode?: View
	className?: string
}

export function Calendar(props: CalendarProps) {
	const [date, setDate] = useState(props.defaultDate ?? new Date(Date.now()))
	const [view, setView] = useState<View>(props.defaultView ?? 'monthly')
	return (
		<div className={props.className}>
			<context.Provider
				value={{
					date,
					setDate,
					view,
					setView,
					mode: props.mode,
				}}
			>
				{props.children}
			</context.Provider>
		</div>
	)
}

export function useCalendarContext() {
	const ctx = useContext(context)
	if (!ctx) throw new Error('context must be used inside a provider')
	return ctx
}

export function CalendarHeader({ children, ...rest }: PropsWithChildren & React.ComponentProps<'div'>) {
	return (
		<div {...rest} className={cn('mb-4 flex flex-col gap-2', rest.className)}>
			{children}
		</div>
	)
}

export function CalendarTitle() {
	const { date, setDate, view } = useCalendarContext()
	return (
		<div className='mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between'>
			<span className='flex w-full items-center gap-4 md:w-auto'>
				<Popover>
					<PopoverTrigger asChild>
						<div className='flex min-w-16 cursor-pointer flex-col items-center justify-center rounded-lg border border-border'>
							<span className='w-full rounded-tl-lg rounded-tr-lg bg-primary/80 py-1.5 text-center font-bold text-md text-primary-foreground'>
								{format(date, 'MMM')}
							</span>
							<span className='w-full rounded-br-lg rounded-bl-lg py-1.5 text-center font-medium text-sm'>{format(date, 'dd')}</span>
						</div>
					</PopoverTrigger>
					<PopoverContent className='flex items-center justify-center p-0'>
						<CalendarComp mode='single' selected={date} onSelect={val => val && setDate(val)} />
					</PopoverContent>
				</Popover>
				<span>
					<h2 className='font-bold text-2xl'>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
					<p className='font-medium text-muted-foreground text-sm'>{`${format(view === 'weekly' ? startOfWeek(date) : startOfMonth(date), 'MMM dd')} - ${format(view === 'weekly' ? endOfWeek(date) : endOfMonth(date), 'MMM dd, yyy')}`}</p>
				</span>
			</span>
		</div>
	)
}

export function CalendarControlls() {
	const { view, setView, date, setDate, mode } = useCalendarContext()
	const viewMode = mode ?? view
	const navigateWeeks = (direction: 'prev' | 'next' | 'today') =>
		direction === 'today' ? setDate(new Date(Date.now())) : direction === 'prev' ? setDate(subWeeks(date, 1)) : setDate(addWeeks(date, 1))
	const navigateMonths = (direction: 'prev' | 'next' | 'today') =>
		direction === 'today' ? setDate(new Date(Date.now())) : direction === 'prev' ? setDate(subMonths(date, 1)) : setDate(addMonths(date, 1))

	return (
		<div className='flex w-full items-center justify-between space-x-2 md:w-auto'>
			<ButtonGroup>
				<Button
					onClick={() => (viewMode === 'weekly' ? navigateWeeks('prev') : navigateMonths('prev'))}
					variant='outline'
					size='icon'
					className='h-8 w-8'
				>
					<ChevronLeft className='h-4 w-4' />
				</Button>
				<Button
					onClick={() => (viewMode === 'weekly' ? navigateWeeks('today') : navigateMonths('today'))}
					variant='outline'
					size='sm'
					className='flex items-center gap-1'
				>
					<CalendarIcon className='mr-1 h-4 w-4' />
					Today
				</Button>
				<Button
					onClick={() => (viewMode === 'weekly' ? navigateWeeks('next') : navigateMonths('next'))}
					variant='outline'
					size='icon'
					className='h-8 w-8'
				>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</ButtonGroup>

			{!mode && (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<ButtonGroup>
							<Button variant='outline' size='sm'>
								View
							</Button>
							<Button variant='outline' size='icon-sm'>
								<ChevronDownIcon />
							</Button>
						</ButtonGroup>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Choose View</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem checked={viewMode === 'weekly'} onCheckedChange={e => setView(e ? 'weekly' : 'monthly')}>
							Weekly
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem checked={viewMode === 'monthly'} onCheckedChange={e => setView(e ? 'monthly' : 'weekly')}>
							Monthly
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	)
}

interface CalendarModelProps<T> {
	events?: T[]
	getEventsForDay?: (day: Date) => T[]
	renderWeeklyEvent?: (event: T, day: Date) => React.ReactNode
	renderWeeklyEventRow?: (event: T, weekDays: Date[], selectedDate: Date) => React.ReactNode
	renderMonthlyEvent?: (event: T, day: Date, isCurrentMonth: boolean) => React.ReactNode
	renderWeeklyDay?: (day: Date, events: T[]) => React.ReactNode
	renderMonthlyDay?: (day: Date, events: T[], isCurrentMonth: boolean) => React.ReactNode
}

export function CalendarModel<T>({
	events = [],
	getEventsForDay,
	renderWeeklyEvent,
	renderWeeklyEventRow,
	renderMonthlyEvent,
	renderWeeklyDay,
	renderMonthlyDay,
}: CalendarModelProps<T>) {
	const { date, setDate, view } = useCalendarContext()
	const isToday = (date: Date) => isSameDay(date, new Date())
	const weeks = generateCalendar(date)

	const weekStart = useMemo(() => startOfWeek(date), [date])
	const weekEnd = useMemo(() => endOfWeek(date), [date])

	const weekDays = useMemo(() => {
		return eachDayOfInterval({ start: weekStart, end: weekEnd })
	}, [weekStart, weekEnd])

	if (view === 'weekly')
		return (
			<div className='-mx-4 w-full overflow-x-auto px-4 lg:mx-0 lg:px-0'>
				<div className='w-full min-w-250 rounded-lg border border-border lg:w-full lg:min-w-0'>
					<div className='sticky top-0 z-10 border-b bg-background'>
						<div className='grid w-full min-w-250 grid-cols-7 lg:w-full lg:min-w-0'>
							{weekDays.map(day => (
								<div
									key={day.toISOString()}
									className={cn(
										'cursor-pointer border-r p-4 text-center last:border-r-0 hover:bg-primary/5 md:p-5 lg:p-3 xl:p-4',
										isSameDay(date, day) && 'rounded-t-sm border-primary border-t border-r border-l bg-primary/5',
									)}
									onClick={() => setDate(day)}
								>
									<p className='text-muted-foreground text-xs uppercase md:text-sm'>{format(day, 'EEE')}</p>
									<p
										className={cn(
											'mt-1 font-semibold text-xl md:text-2xl lg:text-lg xl:text-xl',
											isToday(day) &&
												'inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-10 md:w-10 lg:h-8 lg:w-8 xl:h-9 xl:w-9',
										)}
									>
										{format(day, 'd')}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className='divide-y'>
						{events.length > 0 && renderWeeklyEventRow ? (
							events.map((event, index) => <div key={index}>{renderWeeklyEventRow(event, weekDays, date)}</div>)
						) : events.length > 0 && renderWeeklyEvent ? (
							events.map((event, index) => {
								return (
									<div key={index} className='grid w-full min-w-250 grid-cols-7 lg:w-full lg:min-w-0'>
										{weekDays.map(day => {
											return (
												<div
													key={day.toISOString()}
													className={cn(
														'min-h-35 border-r p-0 last:border-r-0 md:min-h-40 lg:min-h-30 xl:min-h-35',
														isSameDay(date, day) && 'border-primary border-r border-l bg-primary/5',
													)}
												>
													{renderWeeklyEvent(event, day)}
												</div>
											)
										})}
									</div>
								)
							})
						) : renderWeeklyDay ? (
							<div className='grid w-full min-w-250 grid-cols-7 lg:w-full lg:min-w-0'>
								{weekDays.map(day => {
									const dayEvents = getEventsForDay ? getEventsForDay(day) : []
									return (
										<div
											key={day.toISOString()}
											className={cn(
												'min-h-35 border-r p-0 last:border-r-0 md:min-h-40 lg:min-h-30 xl:min-h-35',
												isSameDay(date, day) && 'border-primary border-r border-l bg-primary/5',
											)}
										>
											{renderWeeklyDay(day, dayEvents)}
										</div>
									)
								})}
							</div>
						) : (
							<div className='grid w-full min-w-250 grid-cols-7 lg:w-full lg:min-w-0'>
								{weekDays.map(day => (
									<div
										key={day.toISOString()}
										className={cn(
											'flex min-h-35 items-center justify-center border-r p-0 font-normal text-muted-foreground last:border-r-0 md:min-h-40 lg:min-h-30 xl:min-h-35',
											isSameDay(date, day) && 'border-primary border-r border-l bg-primary/5',
										)}
									>
										-
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		)

	if (view === 'monthly') {
		const getDayEvents = (day: Date) => {
			if (getEventsForDay) {
				return getEventsForDay(day)
			}
			return []
		}

		return (
			<div className='grid grid-cols-7 gap-1'>
				{DAYS.map(day => (
					<div key={day} className='py-2 text-center font-medium text-muted-foreground text-sm'>
						{day}
					</div>
				))}

				{weeks.map((week, weekIndex) =>
					week.map((cell, dayIndex) => {
						const today = isToday(cell.date)
						const isSelectedDate = isSameDay(cell.date, date)
						const dayEvents = getDayEvents(cell.date)

						return (
							<div
								key={`${weekIndex}-${dayIndex}`}
								className={cn(
									'relative flex min-h-8 flex-col rounded border p-1 transition-colors md:min-h-32',
									cell.isCurrentMonth
										? 'bg-muted'
										: 'bg-[repeating-linear-gradient(145deg,transparent,transparent_10px,var(--border),var(--border)_12px)] bg-muted/30 text-green',
									isSelectedDate && 'ring-2 ring-primary',
									'hover:bg-primary/10',
								)}
								onClick={() => setDate(cell.date)}
							>
								<span
									className={cn(
										'mb-2 flex h-6 w-6 items-center justify-center rounded-full font-bold text-sm',
										today && 'bg-primary text-primary-foreground',
									)}
								>
									{cell.date.getDate()}
								</span>

								<div className='grid space-y-1'>
									{renderMonthlyDay
										? renderMonthlyDay(cell.date, dayEvents, cell.isCurrentMonth)
										: dayEvents.map((event, eventIndex) =>
												renderMonthlyEvent ? <div key={eventIndex}>{renderMonthlyEvent(event, cell.date, cell.isCurrentMonth)}</div> : null,
											)}
								</div>
							</div>
						)
					}),
				)}
			</div>
		)
	}

	return null
}

const generateCalendar = (currentDate: Date): CalendarCell[][] => {
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()
	const firstDayOfMonth = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const weeks: CalendarCell[][] = []
	let week: CalendarCell[] = []

	if (firstDayOfMonth > 0) {
		const prevMonth = month === 0 ? 11 : month - 1
		const prevYear = month === 0 ? year - 1 : year
		const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
		for (let i = 0; i < firstDayOfMonth; i++) {
			week.push({
				date: new Date(prevYear, prevMonth, daysInPrevMonth - firstDayOfMonth + 1 + i),
				isCurrentMonth: false,
			})
		}
	}

	for (let d = 1; d <= daysInMonth; d++) {
		week.push({ date: new Date(year, month, d), isCurrentMonth: true })
		if (week.length === 7) {
			weeks.push(week)
			week = []
		}
	}

	if (week.length > 0) {
		const nextMonth = month === 11 ? 0 : month + 1
		const nextYear = month === 11 ? year + 1 : year
		let d = 1
		while (week.length < 7) {
			week.push({
				date: new Date(nextYear, nextMonth, d++),
				isCurrentMonth: false,
			})
		}
		weeks.push(week)
	}

	return weeks
}
