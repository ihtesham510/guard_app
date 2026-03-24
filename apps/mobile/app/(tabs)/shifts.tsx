import { useLayoutEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/common/themed-text'
import { Calendar } from '@/components/shift/calendar'
import { useStyles } from '@/hooks/use-styles'

export default function TabScreen() {
	const { theme } = useStyles()
	const [date, setDate] = useState(new Date(Date.now()))
	const [weekly, setWeekly] = useState(false)
	const [size, setSize] = useState({
		width: 0,
		height: 0,
	})
	const postionX = useSharedValue(0)

	useLayoutEffect(() => {
		postionX.value = withTiming(Number(weekly), {
			duration: 250,
		})
	}, [weekly, postionX])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: (size.width / 2) * postionX.value,
				},
			],
		}
	})
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
			<View
				onLayout={e => {
					setSize({
						width: e.nativeEvent.layout.width,
						height: e.nativeEvent.layout.height,
					})
				}}
				style={{
					marginBottom: 20,
					borderRadius: 10,
					backgroundColor: theme.accent,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<Animated.View
					style={[
						{
							width: (size.width - 15) / 2,
							backgroundColor: theme.card,
							borderRadius: 10,
							margin: 4,
						},
						animatedStyle,
					]}
				/>
				<Pressable
					style={{
						padding: 10,
						width: size.width / 2,
						justifyContent: 'center',
						backgroundColor: 'transparent',
						alignItems: 'center',
						position: 'absolute',
					}}
					onPress={() => {
						setWeekly(false)
					}}
				>
					<ThemedText>Monthly</ThemedText>
				</Pressable>
				<Pressable
					style={{
						padding: 10,
						width: size.width / 2,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'transparent',
					}}
					onPress={() => setWeekly(true)}
				>
					<ThemedText>Weekly</ThemedText>
				</Pressable>
			</View>
			<Calendar weeklyView={weekly} date={date} onChange={setDate} />
		</SafeAreaView>
	)
}
