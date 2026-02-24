import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Platform, Pressable, TextInput } from 'react-native'
import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { createStyles, useStyles } from '@/hooks/use-styles'
import { authClient } from '@/lib/auth-client'

export default function HomeScreen() {
	const { styles } = useStyles(styleSheet)
	const session = authClient.useSession()
	const [username, setUsername] = useState<string>()
	const [password, setPasswrod] = useState<string>()
	const handleSubmit = () => {
		if (!username || !password) {
			return
		}
		authClient.signIn.email({
			email: username,
			password,
		})
	}
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
		>
			{session.data ? (
				<ThemedView style={styles.titleContainer}>
					<Pressable onPress={async () => await authClient.signOut()}>
						<ThemedText type='title'>Welcome! {session.data.user.name}</ThemedText>
					</Pressable>
					<HelloWave />
				</ThemedView>
			) : (
				<React.Fragment>
					<ThemedView style={styles.stepContainer}>
						<ThemedText type='subtitle'>Email</ThemedText>
						<TextInput value={username} onChangeText={e => setUsername(e)} style={styles.input} />
					</ThemedView>
					<ThemedView style={styles.stepContainer}>
						<ThemedText type='subtitle'>password</ThemedText>
						<TextInput value={password} onChangeText={e => setPasswrod(e)} style={styles.input} secureTextEntry />
					</ThemedView>
					<ThemedView style={styles.stepContainer}>
						<Pressable onPress={handleSubmit} style={styles.button}>
							<ThemedText type='subtitle'>Submit</ThemedText>
						</Pressable>
					</ThemedView>
				</React.Fragment>
			)}
			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>Step 1: Try it</ThemedText>
				<ThemedText>
					Edit <ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText> to see changes. Press{' '}
					<ThemedText type='defaultSemiBold'>
						{Platform.select({
							ios: 'cmd + d',
							android: 'cmd + m',
							web: 'F12',
						})}
					</ThemedText>{' '}
					to open developer tools.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<Link href='/modal'>
					<Link.Trigger>
						<ThemedText type='subtitle'>Step 2: Explore</ThemedText>
					</Link.Trigger>
					<Link.Preview />
					<Link.Menu>
						<Link.MenuAction title='Action' icon='cube' onPress={() => alert('Action pressed')} />
						<Link.MenuAction title='Share' icon='square.and.arrow.up' onPress={() => alert('Share pressed')} />
						<Link.Menu title='More' icon='ellipsis'>
							<Link.MenuAction title='Delete' icon='trash' destructive onPress={() => alert('Delete pressed')} />
						</Link.Menu>
					</Link.Menu>
				</Link>

				<ThemedText>{`Tap the Explore tab to learn more about what's included in this starter app.`}</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type='subtitle'>Step 3: Get a fresh start</ThemedText>
				<ThemedText>
					{`When you're ready, run `}
					<ThemedText type='defaultSemiBold'>npm run reset-project</ThemedText> to get a fresh{' '}
					<ThemedText type='defaultSemiBold'>app</ThemedText> directory. This will move the current{' '}
					<ThemedText type='defaultSemiBold'>app</ThemedText> to <ThemedText type='defaultSemiBold'>app-example</ThemedText>.
				</ThemedText>
			</ThemedView>
		</ParallaxScrollView>
	)
}

const styleSheet = createStyles(theme => ({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	input: {
		backgroundColor: theme.background,
		color: 'white',
		height: 54,
		paddingVertical: 10,
		marginBlock: 12,
		borderRadius: 12,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	button: {
		backgroundColor: theme.card,
		flex: 1,
		padding: 18,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
}))
