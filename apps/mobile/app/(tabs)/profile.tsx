import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export default function TabScreen() {
	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<ThemedText>Profile</ThemedText>
		</ThemedView>
	)
}
