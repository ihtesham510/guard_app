import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function TabScreen() {
	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<ThemedText>Attendance</ThemedText>
		</ThemedView>
	)
}
