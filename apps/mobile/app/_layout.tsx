import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import type { PropsWithChildren } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'

export const unstable_settings = {
	anchor: '(tabs)',
}

export default function RootLayout() {
	return (
		<Providers>
			<Stack>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen name='modal' options={{ presentation: 'modal', title: 'Modal' }} />
			</Stack>
			<StatusBar style='auto' />
		</Providers>
	)
}

function Providers({ children }: PropsWithChildren) {
	const colorScheme = useColorScheme()
	const convex_url = process.env.EXPO_PUBLIC_CONVEX_URL
	if (!convex_url) throw new Error('Convex url not provided')
	const client = new ConvexReactClient(convex_url)
	return (
		<ConvexProvider client={client}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>{children}</ThemeProvider>
		</ConvexProvider>
	)
}
