import { DAYS, eachDayOfInterval, endOfWeek, format, generateCalendar, isSameDay, startOfWeek } from '@repo/shared'
import { useMemo } from 'react'
import { type StyleProp, TouchableOpacity, View, type ViewStyle } from 'react-native'
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from 'react-native-reanimated'
import { DateSelector } from '@/components/common/date-selector'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { BottomSheet, BottomSheetContent, BottomSheetTrigger } from '@/components/ui/bottom-sheet'
import { createStyles, useStyles } from '@/hooks/use-styles'

export function Calendar({
	date = new Date(Date.now()),
	weeklyView,
	onChange,
	...rest
}: {
	date?: Date
	weeklyView?: boolean
	onChange?: (e: Date) => void
	eventContainerStyle?: StyleProp<ViewStyle>
	dayContainerStyle?: StyleProp<ViewStyle>
	renderEvent?: (day: Date) => React.ReactNode
}) {
	const { styles, theme } = useStyles(styleSheet)
	const weeks = useMemo(() => generateCalendar(date), [date])
	const weekly = useMemo(
		() =>
			eachDayOfInterval({
				start: startOfWeek(date),
				end: endOfWeek(date),
			}),
		[date],
	)

	function getBorderColor(day: Date) {
		if (isSameDay(day, date)) {
			return theme.primary
		}
		if (isSameDay(day, new Date(Date.now()))) {
			return theme.accent
		}
		return 'transparent'
	}

	return (
		<ThemedView style={styles.container}>
			<BottomSheet>
				<ThemedView>
					<BottomSheetTrigger>
						<ThemedText type='title'>{format(date, 'd MMM yyy')}</ThemedText>
					</BottomSheetTrigger>
					<BottomSheetContent view={styles.contentContainer}>
						<DateSelector date={date} onChange={e => onChange?.(e)} />
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
			{!weeklyView && (
				<Animated.View style={styles.weeksContainer} exiting={FadeOutLeft.duration(250)} entering={FadeInLeft.duration(250)}>
					{weeks.map((week, index) => (
						<ThemedView key={index} style={styles.weekRow}>
							{week.map(day => (
								<View key={day.date.toString()} style={[rest.dayContainerStyle]}>
									<TouchableOpacity
										style={styles.dateContainer}
										onPress={() => {
											onChange?.(day.date)
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
									<ThemedView
										style={[
											rest.eventContainerStyle,
											{
												opacity: rest.renderEvent && day.isCurrentMonth ? 0 : 1,
											},
										]}
									>
										{rest.renderEvent?.(day.date)}
									</ThemedView>
								</View>
							))}
						</ThemedView>
					))}
				</Animated.View>
			)}
			{weeklyView && (
				<Animated.View exiting={FadeOutRight.duration(250)} entering={FadeInRight.duration(250)} style={styles.weekRow}>
					{weekly.map(day => (
						<View key={day.toString()} style={[rest.dayContainerStyle]}>
							<TouchableOpacity
								style={styles.dateContainer}
								onPress={() => {
									onChange?.(day)
								}}
							>
								<View
									style={[
										{
											borderWidth: 2,
										},
										styles.cellContainer,
									]}
								>
									<ThemedText style={[styles.date]}>{day.getDate()}</ThemedText>
								</View>
							</TouchableOpacity>
							<ThemedView
								style={[
									rest.eventContainerStyle,
									{
										opacity: rest.renderEvent ? 0 : 1,
									},
								]}
							>
								{rest.renderEvent?.(day)}
							</ThemedView>
						</View>
					))}
				</Animated.View>
			)}
		</ThemedView>
	)
}

const styleSheet = createStyles(theme => ({
	container: {
		width: '100%',
		flexDirection: 'column',
		gap: 8,
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
		gap: 8,
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
