import {
	addYears,
	DAYS,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachYearOfInterval,
	endOfMonth,
	endOfYear,
	format,
	generateCalendar,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfYear,
	subYears,
} from '@repo/shared'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/themed-view'
import { createStyles, useStyles } from '@/hooks/use-styles'
import { ThemedText } from './themed-text'
import { BottomSheet, BottomSheetContent, BottomSheetTrigger } from './ui/bottom-sheet'
import { WheelPicker } from './ui/wheel-picker'

export function Calendar() {
	const { styles, theme } = useStyles(styleSheet)
	const [selectedDate, setSelectedDate] = useState(new Date(Date.now()))
	const weeks = generateCalendar(selectedDate)

	function getBorderColor(day: Date) {
		if (isSameDay(day, selectedDate)) {
			return theme.primary
		}
		if (isSameDay(day, new Date(Date.now()))) {
			return theme.accent
		}
		return 'transparent'
	}

	return (
		<SafeAreaView>
			<ThemedView style={styles.container}>
				<BottomSheet>
					<ThemedView>
						<BottomSheetTrigger>
							<ThemedText type='title'>{format(selectedDate, 'd MMM')}</ThemedText>
						</BottomSheetTrigger>
						<BottomSheetContent view={styles.contentContainer}>
							<DateSelector current={selectedDate} onChange={e => setSelectedDate(e)} />
						</BottomSheetContent>
					</ThemedView>
				</BottomSheet>
				<ThemedView style={styles.daysContainer}>
					{DAYS.map(d => (
						<View
							key={d}
							style={[
								styles.cellContainer,
								{
									backgroundColor: 'transparent',
								},
							]}
						>
							<ThemedText style={styles.day}>{d.toUpperCase()}</ThemedText>
						</View>
					))}
				</ThemedView>
				<ThemedView style={styles.weeksContainer}>
					{weeks.map((week, index) => (
						<ThemedView key={index} style={styles.weekRow}>
							{week.map(day => (
								<TouchableOpacity
									key={day.date.toString()}
									style={styles.dateContainer}
									onPress={() => {
										setSelectedDate(day.date)
									}}
								>
									<View
										style={[
											{
												backgroundColor: day.isCurrentMonth ? theme.card : theme.background,
												borderWidth: 2,
												borderColor: day.isCurrentMonth ? getBorderColor(day.date) : theme.muted,
											},
											styles.cellContainer,
										]}
									>
										<ThemedText style={[styles.date]}>{day.date.getDate()}</ThemedText>
									</View>
								</TouchableOpacity>
							))}
						</ThemedView>
					))}
				</ThemedView>
			</ThemedView>
		</SafeAreaView>
	)
}

export function DateSelector({ current, onChange }: { current: Date; onChange: (e: Date) => void }) {
	const months = eachMonthOfInterval({
		start: startOfYear(current),
		end: endOfYear(current),
	}).map(date => ({ label: format(date, 'MMM'), date }))

	const days = eachDayOfInterval({
		start: startOfMonth(current),
		end: endOfMonth(current),
	})

	const years = eachYearOfInterval({
		start: subYears(new Date(Date.now()), 5),
		end: addYears(new Date(Date.now()), 5),
	})

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'row',
				gap: 20,
				width: '100%',
				paddingHorizontal: 30,
			}}
		>
			<WheelPicker
				style={{ flex: 1, width: '30%' }}
				render={item => <ThemedText>{item.getDate()}</ThemedText>}
				items={days}
				initialIndex={days.findIndex(item => isSameDay(item, current))}
				onIndexChange={index => {
					const d = new Date(current)
					d.setDate(days[index].getDate())
					onChange(d)
				}}
			/>
			<WheelPicker
				style={{ flex: 1, width: '30%' }}
				initialIndex={months.findIndex(item => isSameMonth(item.date, current))}
				render={item => <ThemedText>{item.label}</ThemedText>}
				items={months}
				onIndexChange={index => {
					const d = new Date(current)
					const lastDay = new Date(d.getFullYear(), months[index].date.getMonth() + 1, 0).getDate()
					d.setDate(Math.min(d.getDate(), lastDay)) // guard against Jan 31 → Feb overflow
					d.setMonth(months[index].date.getMonth())
					onChange(d)
				}}
			/>
			<WheelPicker
				style={{ flex: 1, width: '30%' }}
				initialIndex={years.findIndex(item => item.getFullYear() === current.getFullYear())}
				render={item => <ThemedText>{item.getFullYear()}</ThemedText>}
				items={years}
				onIndexChange={index => {
					const d = new Date(current)
					d.setFullYear(years[index].getFullYear())
					onChange(d)
				}}
			/>
		</View>
	)
}
const styleSheet = createStyles(theme => ({
	container: {
		flex: 1,
		width: '100%',
		padding: 20,
		flexDirection: 'column',
		gap: 14,
	},
	daysContainer: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	day: {
		fontSize: 12,
	},
	weeksContainer: {
		width: '100%',
		gap: 10,
	},
	weekRow: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dateContainer: {},
	cellContainer: {
		width: 38,
		height: 38,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	date: {},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: theme.card,
		color: theme.text,
		paddingBottom: 30,
	},
	handle: {
		backgroundColor: theme.card,
		color: theme.primaryForeground,
		borderBottomColor: 'transparent',
		borderTopColor: 'transparent',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	indicator: {
		backgroundColor: theme.cardForeground,
	},
	sheetBackground: {
		backgroundColor: theme.card,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
}))
