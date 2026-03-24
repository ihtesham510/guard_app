import { GestureHandlerRootView } from 'react-native-gesture-handler'
import type { GestureHandlerRootViewProps } from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView'
import { useThemeColor } from '@/hooks/use-theme-color'

export function ThemedRootView(
	props: GestureHandlerRootViewProps & {
		lightColor?: string
		darkColor?: string
	},
) {
	const backgroundColor = useThemeColor({ light: props.lightColor, dark: props.darkColor }, 'background')
	return (
		<GestureHandlerRootView
			style={[
				{
					flex: 1,
					backgroundColor,
				},
				props.style,
			]}
			{...props}
		/>
	)
}
