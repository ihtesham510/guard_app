import { type ReactNode, useRef } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, {
	interpolate,
	type SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'
import { createStyles, useStyles } from '@/hooks/use-styles'

const AnimatedGHFlatList = Animated.createAnimatedComponent(FlatList)

const __ITEM_HEIGHT = 50
const __VISIBLE_ITEMS = 5
const __WIDTH = __ITEM_HEIGHT * __VISIBLE_ITEMS

export interface DateItem {
	value: Date
	label: string
}

interface WheelPickerProps<T> {
	items: T[]
	onIndexChange?: (index: number) => void
	render: (item: T) => ReactNode
	initialIndex?: number
	style?: StyleProp<ViewStyle>
}

export function WheelPicker<T>({ items, onIndexChange, initialIndex = 0, render, style }: WheelPickerProps<T>) {
	const { styles } = useStyles(styleSheet)
	const scrollX = useSharedValue(0)
	const onScroll = useAnimatedScrollHandler(e => {
		const value = e.contentOffset.y / __ITEM_HEIGHT
		scrollX.value = withSpring(value, {
			duration: 20,
		})
	})
	const listRef = useRef<FlatList>(null)
	return (
		<View style={[styles.wheelContainer, style]}>
			<View style={styles.selectionHighlight} pointerEvents='none' />
			<AnimatedGHFlatList
				style={{ height: __ITEM_HEIGHT * __VISIBLE_ITEMS }} // ← key fix
				data={items}
				ref={listRef}
				contentContainerStyle={{
					paddingVertical: (__WIDTH - __ITEM_HEIGHT) / 2,
				}}
				showsVerticalScrollIndicator={false}
				keyExtractor={(_, index) => String(index)}
				snapToInterval={__ITEM_HEIGHT} // ← snap per item
				decelerationRate='normal' // ← snappy feel
				onMomentumScrollEnd={e => {
					const index = Math.round(e.nativeEvent.contentOffset.y / __ITEM_HEIGHT)
					onIndexChange?.(index)
				}}
				scrollEventThrottle={16}
				getItemLayout={(_, index) => ({
					length: __ITEM_HEIGHT,
					offset: __ITEM_HEIGHT * index,
					index,
				})}
				initialScrollIndex={initialIndex}
				onScroll={onScroll}
				// biome-ignore lint/suspicious/noExplicitAny: <Item is type is T>
				renderItem={(item: any) => (
					<WheelItem item={item.item} scrollX={scrollX} index={item.index}>
						{render(item.item)}
					</WheelItem>
				)}
			/>
		</View>
	)
}
function WheelItem<T>({
	children,
	scrollX,
	index,
}: {
	item: T
	onSelect?: (e: T) => void
	children: ReactNode
	scrollX: SharedValue<number>
	index: number
}) {
	const { styles } = useStyles(styleSheet)
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: interpolate(scrollX.value, [index - 1, index, index + 1], [1, 1.2, 1]),
				},
			],
			opacity: interpolate(scrollX.value, [index - 2, index - 1, index, index + 1, index + 2], [0.2, 0.5, 1, 0.5, 0.2]),
		}
	})
	return <Animated.View style={[styles.item, animatedStyles]}>{children}</Animated.View>
}

const styleSheet = createStyles(theme => ({
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: theme.text,
		marginBottom: 32,
	},
	wheelContainer: {
		height: __ITEM_HEIGHT * __VISIBLE_ITEMS,
		overflow: 'hidden',
	},
	selectionHighlight: {
		position: 'absolute',
		top: __ITEM_HEIGHT * Math.floor(__VISIBLE_ITEMS / 2),
		left: 0,
		right: 0,
		height: __ITEM_HEIGHT,
		backgroundColor: theme.primary,
		opacity: 0.1,
		borderRadius: 8,
		zIndex: 1,
	},
	item: {
		height: __ITEM_HEIGHT,
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
