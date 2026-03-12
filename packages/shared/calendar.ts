export * from 'date-fns'
export type CalendarCell = { date: Date; isCurrentMonth: boolean }

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function generateCalendar(currentDate: Date): CalendarCell[][] {
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
