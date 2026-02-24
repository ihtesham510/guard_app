import { Pressable, type TextStyle, type ViewStyle } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { createStyles, useStyles } from '@/hooks/use-styles'

export function Button({
	text,
	textStyle,
	style,
	...rest
}: {
	text: string
	textStyle?: TextStyle
	style?: ViewStyle
	pressableProps?: React.ComponentProps<typeof Pressable>
	textProps?: React.ComponentProps<typeof ThemedText>
}) {
	const { styles } = useStyles(styleSheet)
	return (
		<Pressable style={[{ ...styles.pressable }, { ...style }]} {...rest.pressableProps}>
			<ThemedText
				type='subtitle'
				style={[
					{ ...styles.text },
					{
						...textStyle,
					},
				]}
				{...rest.textProps}
			>
				{text}
			</ThemedText>
		</Pressable>
	)
}

const styleSheet = createStyles(theme => ({
	pressable: {
		backgroundColor: theme.primary,
		padding: 18,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
	},
	text: {
		color: theme.text,
	},
}))
