import { Calendar05Icon, CalendarAnalysisIcon, Home04Icon, User03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Tabs } from 'expo-router'
import { HapticTab } from '@/components/common/haptic-tab'
import { TabBar } from '@/components/common/tab-bar'

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarButton: HapticTab,
			}}
			tabBar={props => <TabBar {...props} />}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={Home04Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
			<Tabs.Screen
				name='shifts'
				options={{
					title: 'Schedule',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={Calendar05Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
			<Tabs.Screen
				name='attendance'
				options={{
					title: 'Attendance',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={CalendarAnalysisIcon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={User03Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
		</Tabs>
	)
}
