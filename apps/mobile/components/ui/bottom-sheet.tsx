import { BottomSheetModal, type BottomSheetModalProps, BottomSheetView } from '@gorhom/bottom-sheet'
import { createContext, type PropsWithChildren, useCallback, useContext, useRef } from 'react'
import type { PressableProps, StyleProp, ViewStyle } from 'react-native'
import { Pressable } from 'react-native'
import { createStyles, useStyles } from '@/hooks/use-styles'

interface BottonSheetContext {
	ref: React.RefObject<BottomSheetModal | null>
	open: () => void
	close: () => void
}

interface BottomSheetProps extends BottomSheetModalProps {
	children: React.ReactNode
	view?: StyleProp<ViewStyle>
}

const context = createContext<BottonSheetContext | null>(null)

export function BottomSheet(props: PropsWithChildren) {
	const ref = useRef<BottomSheetModal>(null)
	const open = useCallback(() => {
		if (ref.current) {
			ref.current?.present()
		} else {
		}
	}, [])
	const close = useCallback(() => ref.current?.dismiss(), [])
	return <context.Provider value={{ ref, open, close }}>{props.children}</context.Provider>
}

function useBottonSheet() {
	const ctx = useContext(context)
	if (!ctx) throw new Error('Bottom sheet must be used inside its context ')
	return ctx
}

export function BottomSheetContent(props: BottomSheetProps) {
	const { styles } = useStyles(styleSheet)
	const { ref } = useBottonSheet()
	return (
		<BottomSheetModal
			{...props}
			ref={ref}
			stackBehavior='push'
			handleStyle={[styles.handle, props.handleStyle]}
			handleIndicatorStyle={[styles.indicator, props.handleIndicatorStyle]}
			backgroundStyle={[styles.sheetBackground, props.backgroundStyle]}
			onChange={(e, postion, type) => {
				props.onChange?.(e, postion, type)
			}}
		>
			<BottomSheetView style={props.view}>{props.children}</BottomSheetView>
		</BottomSheetModal>
	)
}

export function BottomSheetTrigger(props: PressableProps) {
	const { open } = useBottonSheet()

	return (
		<Pressable
			{...props}
			onPress={e => {
				open()
				props.onPress?.(e)
			}}
		/>
	)
}
const styleSheet = createStyles(theme => ({
	contentContainer: {
		flex: 1,
		height: 300,
		alignItems: 'center',
		backgroundColor: theme.card,
		color: theme.text,
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
