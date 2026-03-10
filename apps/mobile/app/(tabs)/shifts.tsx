import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function ShiftsTab() {
	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<ThemedText>Shifts</ThemedText>
		</ThemedView>
	)
}
