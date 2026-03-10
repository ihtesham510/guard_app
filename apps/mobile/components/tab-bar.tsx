import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import type { NavigationRoute, ParamListBase } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { type LayoutChangeEvent, TouchableOpacity } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { ThemedView } from '@/components/themed-view'
import { createStyles, useStyles } from '@/hooks/use-styles'
import { ThemedText } from './themed-text'

interface TabBarProps extends BottomTabBarProps {}

export function TabBar(props: TabBarProps) {
	const { styles } = useStyles(styleSheet)
	const index = props.state.index
	const [dimenstions, setDimentions] = useState({
		width: 0,
		height: 0,
	})
	const buttonWidth = dimenstions.width / props.state.routes.length
	const tabPostionX = useSharedValue(0)

	useEffect(() => {
		tabPostionX.value = withSpring(buttonWidth * index, {
			damping: 13,
			stiffness: 140,
			mass: 1,
			overshootClamping: false,
		})
	}, [index, tabPostionX, buttonWidth])

	const animatedTabStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: tabPostionX.value,
			},
		],
	}))

	const onLayout = (e: LayoutChangeEvent) => {
		setDimentions({
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
		})
	}
	return (
		<ThemedView onLayout={onLayout} style={styles.container}>
			<Animated.View
				style={[
					styles.circle,
					{
						width: buttonWidth - 20,
						height: dimenstions.height - 12,
					},
					animatedTabStyle,
				]}
			/>
			{props.state.routes.map((route, index) => (
				<Tab route={route} key={index} index={index} {...props} />
			))}
		</ThemedView>
	)
}

interface TabProps extends TabBarProps {
	route: NavigationRoute<ParamListBase, string>
	index: number
}

function Tab(props: TabProps) {
	const { styles, theme } = useStyles(styleSheet)
	const { options } = props.descriptors[props.route.key]

	// biome-ignore lint/suspicious/noExplicitAny: <lable can also be ReactNode or ()=>ReactNode>
	const label: any =
		options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : props.route.name

	const isFocused = props.state.index === props.index

	const onPress = () => {
		const event = props.navigation.emit({
			type: 'tabPress',
			target: props.route.key,
			canPreventDefault: true,
		})

		if (!isFocused && !event.defaultPrevented) {
			props.navigation.navigate(props.route.name, props.route.params)
		}
	}

	const onLongPress = () => {
		props.navigation.emit({
			type: 'tabLongPress',
			target: props.route.key,
		})
	}

	const scale = useSharedValue(0)

	useEffect(() => {
		scale.value = withSpring(isFocused ? 1 : 0, {
			damping: 12,
			stiffness: 130,
			mass: 1,
			overshootClamping: false,
		})
	}, [scale, isFocused])

	const animatedTextStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scale.value, [0, 1], [1, 0])
		return {
			opacity,
		}
	})
	const animatedIconView = useAnimatedStyle(() => {
		const iconScale = interpolate(scale.value, [0, 1], [1, 1.2])
		const position = interpolate(scale.value, [0, 1], [0, 14])
		return {
			transform: [
				{
					scale: iconScale,
				},
			],
			top: position,
		}
	})

	return (
		<TouchableOpacity
			accessibilityRole='button'
			accessibilityState={isFocused ? { selected: true } : {}}
			testID={options.tabBarButtonTestID}
			onPress={onPress}
			onLongPress={onLongPress}
			style={[styles.tab, {}]}
		>
			<Animated.View style={animatedIconView}>
				{options.tabBarIcon?.({
					focused: isFocused,
					size: 24,
					color: isFocused ? theme.primaryForeground : theme.secondaryForeground,
				})}
			</Animated.View>
			<ThemedText
				animated
				style={[
					{
						color: isFocused ? theme.primaryForeground : theme.secondaryForeground,
						fontSize: 12,
					},
					animatedTextStyle,
				]}
			>
				{label}
			</ThemedText>
		</TouchableOpacity>
	)
}

const styleSheet = createStyles(theme => ({
	container: {
		position: 'absolute',
		bottom: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: theme.card,
		paddingVertical: 10,
		borderRadius: 50,
		gap: 4,
		marginHorizontal: 22,
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 4,
		paddingVertical: 6,
		borderRadius: 50,
	},
	circle: {
		position: 'absolute',
		borderRadius: 50,
		backgroundColor: theme.primary,
		marginHorizontal: 10,
	},
}))
