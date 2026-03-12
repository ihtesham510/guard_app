import { DAYS, eachMonthOfInterval, endOfYear, format, generateCalendar, isSameDay, startOfYear } from '@repo/shared'
import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withClamp, withSpring } from 'react-native-reanimated'
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
					{/* <ThemedView> */}
					{/* 	<DateSelector current={selectedDate} onChange={() => {}} /> */}
					{/* </ThemedView> */}
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

	return (
		<WheelPicker
			render={item => {
				return <ThemedText>{item.label}</ThemedText>
			}}
			items={months}
			initialIndex={0}
			onSelect={item => {
				onChange(item.date)
			}}
		/>
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
