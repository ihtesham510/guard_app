import { type ReactNode, useEffect, useRef, useState } from 'react'
import { type NativeScrollEvent, type NativeSyntheticEvent, Pressable, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { createStyles, useStyles } from '@/hooks/use-styles'
import { useDebouncedCallback } from '@mantine/hooks'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import type { StyleProp, ViewStyle } from 'react-native'

const ITEM_HEIGHT = 50
const VISIBLE_ITEMS = 5

export interface DateItem {
	value: Date
	label: string
}

interface WheelPickerProps<T> {
	items: T[]
	selected?: T
	onSelect?: (item: T) => void
	indexSelected?: number
	render: (item: T, isSelected: boolean) => ReactNode
	initialIndex?: number
	style?: StyleProp<ViewStyle>
}

export function WheelPicker<T>({ items, onSelect, initialIndex = 0, render, style, selected, indexSelected }: WheelPickerProps<T>) {
	const { styles } = useStyles(styleSheet)
	const scrollRef = useRef<ScrollView>(null)
	const selectedIndexRef = useRef<number>(initialIndex)
	const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex)
	const debouce = useDebouncedCallback((clamped: number) => {
		onSelect?.(items[clamped])
	}, 300)

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
		const y = event.nativeEvent.contentOffset.y
		const index = Math.round(y / ITEM_HEIGHT)
		const clamped = Math.max(0, Math.min(index, items.length - 1))
		if (clamped !== selectedIndexRef.current) {
			selectedIndexRef.current = clamped
			setSelectedIndex(clamped)
			debouce(clamped)
		}
	}

	const scrollToIndex = (index: number): void => {
		selectedIndexRef.current = index
		scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true })
		setSelectedIndex(index)
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <cannot use function because it causes infinite loop>
	useEffect(() => {
		if (selected) {
			const index = items.indexOf(selected)
			if (index !== -1) {
				scrollToIndex(index)
			}
		}
	}, [selected])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <cannot use function because it causes infinite loop>
	useEffect(() => {
		if (indexSelected !== undefined && selectedIndex !== -1) {
			scrollToIndex(indexSelected)
		}
	}, [indexSelected])

	return (
		<View style={[styles.wheelContainer, style]}>
			<View style={styles.selectionHighlight} pointerEvents='none' />
			<ScrollView
				ref={scrollRef}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				decelerationRate='normal'
				onScroll={handleScroll}
				scrollEventThrottle={40}
				contentContainerStyle={{
					paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
				}}
				contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
			>
				{items.map((item, index) => (
					<RenderItem
						item={item}
						index={index}
						selectedIndex={selectedIndex}
						onSelect={(e, i) => {
							onSelect?.(e)
							selectedIndexRef.current = i
							setSelectedIndex(i)
							scrollToIndex(i)
						}}
						key={index}
					>
						{render(item, index === selectedIndex)}
					</RenderItem>
				))}
			</ScrollView>
		</View>
	)
}
function RenderItem<T>({
	children,
	item,
	index,
	onSelect,
	selectedIndex,
}: {
	item: T
	index: number
	selectedIndex: number
	onSelect?: (e: T, index: number) => void
	children: ReactNode
}) {
	const { styles } = useStyles(styleSheet)
	const scaleValue = useSharedValue(0)
	const opacityValue = useSharedValue(0)
	useEffect(() => {
		scaleValue.value = withSpring(selectedIndex === index ? 1 : 0, {
			duration: 30,
		})
		opacityValue.value = selectedIndex === index ? 1 : selectedIndex - 1 === index || selectedIndex + 1 === index ? 0.5 : 0
	}, [selectedIndex, index, scaleValue, opacityValue])
	const animatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(scaleValue.value, [0, 1], [1, 1.5], 'clamp')
		const opacity = interpolate(opacityValue.value, [0, 0.5, 1], [0.2, 0.5, 1], 'clamp')
		return {
			transform: [{ scale }],
			opacity,
		}
	})

	return (
		<Animated.View key={index} style={[styles.item, animatedStyle]}>
			<Pressable
				onPress={() => {
					onSelect?.(item, index)
				}}
			>
				{children}
			</Pressable>
		</Animated.View>
	)
}

const styleSheet = createStyles(theme => ({
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: theme.text,
		marginBottom: 32,
	},
	wheelContainer: {
		height: ITEM_HEIGHT * VISIBLE_ITEMS,
		position: 'relative',
	},
	selectionHighlight: {
		position: 'absolute',
		top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
		left: 0,
		right: 0,
		height: ITEM_HEIGHT,
		backgroundColor: theme.primary,
		opacity: 0.1,
		borderRadius: 8,
		zIndex: 1,
	},
	item: {
		height: ITEM_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectedText: {
		fontWeight: '700',
		color: '#a5b4fc',
		fontSize: 20,
	},
	selected: {
		marginTop: 32,
		fontSize: 16,
	},
}))
