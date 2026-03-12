import { type ReactNode, useRef, useState } from 'react'
import { type NativeScrollEvent, type NativeSyntheticEvent, Pressable, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { createStyles, useStyles } from '@/hooks/use-styles'

const ITEM_HEIGHT = 50
const VISIBLE_ITEMS = 5

export interface DateItem {
	value: Date
	label: string
}

interface WheelPickerProps<T> {
	items: T[]
	onSelect?: (item: T) => void
	render: (item: T, isSelected: boolean) => ReactNode
	initialIndex?: number
}

export function WheelPicker<T>({ items, onSelect, initialIndex = 0, render }: WheelPickerProps<T>) {
	const { styles } = useStyles(styleSheet)
	const scrollRef = useRef<ScrollView>(null)
	const selectedIndexRef = useRef<number>(initialIndex)
	const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex)

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
		const y = event.nativeEvent.contentOffset.y
		const index = Math.round(y / ITEM_HEIGHT)
		const clamped = Math.max(0, Math.min(index, items.length - 1))
		if (clamped !== selectedIndexRef.current) {
			selectedIndexRef.current = clamped
			setSelectedIndex(clamped)
			onSelect?.(items[clamped])
		}
	}

	const scrollToIndex = (index: number): void => {
		selectedIndexRef.current = index
		scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true })
	}

	return (
		<View style={styles.wheelContainer}>
			<View style={styles.selectionHighlight} pointerEvents='none' />

			<ScrollView
				ref={scrollRef}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				decelerationRate='fast'
				onMomentumScrollEnd={handleScroll}
				contentContainerStyle={{
					paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
				}}
				contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
			>
				{items.map((item, index) => (
					<RenderItem
						item={item}
						index={index}
						onSelect={(e, i) => {
							onSelect?.(e)
							selectedIndexRef.current = i
							setSelectedIndex(i)
							scrollToIndex(i)
						}}
						selectedIndex={selectedIndex}
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
	selectedIndex,
	onSelect,
}: {
	item: T
	index: number
	selectedIndex: number
	onSelect?: (e: T, index: number) => void
	children: ReactNode
}) {
	const { styles } = useStyles(styleSheet)
	const distance = Math.abs(index - selectedIndex)
	const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.3
	const scale = distance === 0 ? 1 : distance === 1 ? 0.9 : 0.8

	return (
		<View key={index} style={styles.item}>
			<Pressable
				onPress={() => {
					onSelect?.(item, index)
				}}
			>
				{children}
			</Pressable>
		</View>
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
		width: '100%',
		position: 'relative',
	},
	selectionHighlight: {
		position: 'absolute',
		top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
		left: 0,
		right: 0,
		height: ITEM_HEIGHT,
		backgroundColor: 'rgba(99, 102, 241, 0.2)',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#6366f1',
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
		color: '#94a3b8',
	},
}))
