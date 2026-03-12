import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import * as SplashScreen from 'expo-splash-screen'
import { type PropsWithChildren, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { createStyles, useStyles } from '@/hooks/use-styles'
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
	const { styles } = useStyles(styleSheet)
	const session = authClient.useSession()

	useEffect(() => {
		if (!session.isPending) {
			SplashScreen.hide()
		}
	}, [session.isPending])

	if (session.isPending) return null
	return (
		<GestureHandlerRootView style={styles.root}>
			<BottomSheetModalProvider>
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
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
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

const styleSheet = createStyles(() => ({
	root: {
		flex: 1,
	},
}))
