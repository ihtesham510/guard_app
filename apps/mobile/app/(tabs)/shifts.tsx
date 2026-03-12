import { Calendar } from '@/components/calendar'
import { ThemedView } from '@/components/themed-view'
import { createStyles, useStyles } from '@/hooks/use-styles'

export default function TabScreen() {
	const { styles } = useStyles(styleSheet)
	return (
		<ThemedView style={styles.container}>
			<Calendar />
		</ThemedView>
	)
}

const styleSheet = createStyles(theme => ({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
}))
