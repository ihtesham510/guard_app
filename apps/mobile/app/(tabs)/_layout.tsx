import { Calendar05Icon, CalendarAnalysisIcon, Home04Icon, User03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Tabs } from 'expo-router'
import { HapticTab } from '@/components/haptic-tab'
import { TabBar } from '@/components/tab-bar'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabLayout() {
	const colorScheme = useColorScheme()

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
					headerShown: false,
					tabBarButton: HapticTab,
				}}
				tabBar={props => <TabBar {...props} />}
			>
				<Tabs.Screen
					name='index'
					options={{
						title: 'Home',
						tabBarIcon: ({ color, size, focused }) => (
							<HugeiconsIcon icon={Home04Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
						),
					}}
				/>
				<Tabs.Screen
					name='shifts'
					options={{
						title: 'Schedule',
						tabBarIcon: ({ color, size, focused }) => (
							<HugeiconsIcon icon={Calendar05Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
						),
					}}
				/>
				<Tabs.Screen
					name='attendance'
					options={{
						title: 'Attendance',
						tabBarIcon: ({ color, size, focused }) => (
							<HugeiconsIcon icon={CalendarAnalysisIcon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
						),
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profile',
						tabBarIcon: ({ color, size, focused }) => (
							<HugeiconsIcon icon={User03Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	)
}
