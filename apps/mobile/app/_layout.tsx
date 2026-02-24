import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import * as SplashScreen from 'expo-splash-screen'
import { type PropsWithChildren, useEffect } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { authClient } from '@/lib/auth-client'

export const unstable_settings = {
	anchor: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	return (
		<Providers>
			<App />
		</Providers>
	)
}

function App() {
	const session = authClient.useSession()

	useEffect(() => {
		if (!session.isPending) {
			SplashScreen.hide()
		}
	}, [session.isPending])

	if (session.isPending) return null
	return (
		<>
			<Stack
				screenOptions={{
					animation: 'none',
				}}
			>
				<Stack.Protected guard={!session.isPending && !session.data}>
					<Stack.Screen name='index' options={{ headerShown: false }} />
				</Stack.Protected>

				<Stack.Protected guard={!session.isPending && !session.data}>
					<Stack.Screen name='sign-up' options={{ headerShown: false }} />
				</Stack.Protected>
				<Stack.Protected guard={!session.isPending && !!session.data}>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				</Stack.Protected>
			</Stack>
			<StatusBar style='auto' />
		</>
	)
}

function Providers({ children }: PropsWithChildren) {
	const colorScheme = useColorScheme()
	const convex_url = process.env.EXPO_PUBLIC_CONVEX_URL
	if (!convex_url) throw new Error('Convex url not provided')
	const client = new ConvexReactClient(convex_url)
	return (
		<ConvexProvider client={client}>
			<ConvexBetterAuthProvider client={client} authClient={authClient}>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>{children}</ThemeProvider>
			</ConvexBetterAuthProvider>
		</ConvexProvider>
	)
}
