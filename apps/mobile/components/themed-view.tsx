import { View, type ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { useThemeColor } from '@/hooks/use-theme-color'

export type ThemedViewProps = ViewProps & {
	lightColor?: string
	darkColor?: string
	animated?: boolean
}

export function ThemedView({ style, lightColor, darkColor, animated, ...otherProps }: ThemedViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
	if (animated) {
		return <Animated.View style={[{ backgroundColor }, style]} {...otherProps} />
	}
	return <View style={[{ backgroundColor }, style]} {...otherProps} />
}
