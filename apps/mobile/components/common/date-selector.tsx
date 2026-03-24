import {
	addYears,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachYearOfInterval,
	endOfMonth,
	endOfYear,
	format,
	startOfMonth,
	startOfYear,
	subYears,
} from '@repo/shared'
import { useMemo } from 'react'
import { View } from 'react-native'
import { ThemedText } from '@/components/common/themed-text'
import { WheelPicker } from '@/components/ui/wheel-picker'

export function DateSelector({ date = new Date(Date.now()), onChange }: { date?: Date; onChange?: (date: Date) => void }) {
	const days = useMemo(
		() =>
			eachDayOfInterval({
				start: startOfMonth(date),
				end: endOfMonth(date),
			}),
		[date],
	)
	const months = useMemo(
		() =>
			eachMonthOfInterval({
				start: startOfYear(date),
				end: endOfYear(date),
			}),
		[date],
	)
	const years = useMemo(
		() =>
			eachYearOfInterval({
				start: addYears(date, 5),
				end: subYears(date, 5),
			}),
		[date],
	)
	return (
		<View
			style={{
				width: '100%',
				flex: 1,
				padding: 10,
				flexDirection: 'row',
				justifyContent: 'space-around',
			}}
		>
			<WheelPicker
				items={days}
				style={{
					width: '30%',
				}}
				render={date => <ThemedText>{format(date, 'd')}</ThemedText>}
				onIndexChange={index => {
					const selectedDay = days[index]
					date.setDate(selectedDay.getDate())
					onChange?.(date)
				}}
			/>
			<WheelPicker
				items={months}
				style={{
					width: '30%',
				}}
				render={date => <ThemedText>{format(date, 'MMM')}</ThemedText>}
				onIndexChange={index => {
					const selectedMonth = months[index]
					date.setMonth(selectedMonth.getMonth())
					onChange?.(date)
				}}
			/>
			<WheelPicker
				items={years}
				style={{
					width: '30%',
				}}
				render={date => <ThemedText>{format(date, 'yyy')}</ThemedText>}
				onIndexChange={index => {
					const selectedYear = years[index]
					date.setFullYear(selectedYear.getFullYear())
					onChange?.(date)
				}}
			/>
		</View>
	)
}
