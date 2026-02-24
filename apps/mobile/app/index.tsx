import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Pressable, TextInput, View } from 'react-native'
import z from 'zod'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Button } from '@/components/ui/button'
import { ThemedSafeAreaView } from '@/components/ui/themed-safe-area'
import { Fonts } from '@/constants/theme'
import { createStyles, useStyles } from '@/hooks/use-styles'
import { authClient } from '@/lib/auth-client'

const schema = z.object({
	email: z.email(),
	password: z.string().min(8, { error: 'Password must contain at least 8 characters' }),
})

export default function HomePage() {
	const { styles, theme } = useStyles(styleSheet)
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	})
	const handleSubmit = async (values: z.infer<typeof schema>) => {
		const res = await authClient.signIn.email(values)
		if (res.error?.message) {
			form.setError('email', {
				message: res.error?.message,
				type: 'custom',
			})
		}
	}
	return (
		<ThemedSafeAreaView style={{ flex: 1 }}>
			<ThemedView style={styles.container}>
				<KeyboardAvoidingView behavior='padding'>
					<ThemedView style={styles.header}>
						<ThemedText
							type='title'
							style={{
								fontFamily: Fonts.rounded,
							}}
						>
							Welcome Back!
						</ThemedText>
						<ThemedText type='default' style={{ color: theme.mutedForeground }}>
							Enter your login information
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.socialContainer}>
						<Pressable style={styles.socialButtons}>
							<AntDesign name='google' size={24} color={theme.text} />
							<ThemedText type='defaultSemiBold'>Google</ThemedText>
						</Pressable>
						<Pressable style={styles.socialButtons}>
							<FontAwesome name='github' size={28} color={theme.text} />
							<ThemedText type='defaultSemiBold'>Github</ThemedText>
						</Pressable>
					</ThemedView>
					<View style={styles.formContainer}>
						<Controller
							control={form.control}
							name='email'
							render={({ field: { value, onChange, onBlur }, fieldState }) => (
								<ThemedView style={{ flexDirection: 'column', gap: 8, marginBottom: 4 }}>
									<ThemedText type='subtitle'>Email</ThemedText>
									<TextInput
										style={styles.input}
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										keyboardType='email-address'
										placeholder='Email Address'
										placeholderTextColor={theme.mutedForeground}
									/>
									{fieldState.error && <ThemedText style={{ color: theme.destructive }}>{fieldState.error.message}</ThemedText>}
								</ThemedView>
							)}
						/>
						<Controller
							control={form.control}
							name='password'
							render={({ field: { value, onChange, onBlur }, fieldState }) => (
								<ThemedView style={{ flexDirection: 'column', gap: 8, marginBottom: 6 }}>
									<ThemedView
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}
									>
										<ThemedText type='subtitle'>Password</ThemedText>
										<Link href='/' dismissTo>
											<ThemedText type='link'>Forget Password?</ThemedText>
										</Link>
									</ThemedView>
									<TextInput
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										style={styles.input}
										placeholder='Enter password'
										placeholderTextColor={theme.mutedForeground}
										secureTextEntry
									/>
									{fieldState.error && <ThemedText style={{ color: theme.destructive }}>{fieldState.error.message}</ThemedText>}
								</ThemedView>
							)}
						/>
						<ThemedView>
							<Button text='Sign In' pressableProps={{ onPress: form.handleSubmit(handleSubmit) }} />
						</ThemedView>
					</View>
				</KeyboardAvoidingView>
				<ThemedView style={{ justifyContent: 'center', alignItems: 'center' }}>
					<ThemedText>
						Don't have and account?{' '}
						<Link href='/sign-up' push>
							<ThemedText type='link'>Sign Up</ThemedText>
						</Link>
					</ThemedText>
				</ThemedView>
			</ThemedView>
		</ThemedSafeAreaView>
	)
}

const styleSheet = createStyles(theme => ({
	container: {
		backgroundColor: theme.background,
		padding: 14,
		paddingVertical: 34,
		flex: 1,
		justifyContent: 'space-between',
	},
	header: {
		flexDirection: 'column',
		gap: 12,
		marginTop: 42,
	},
	socialButtons: {
		padding: 18,
		flexGrow: 1,
		borderColor: theme.border,
		borderWidth: 1,
		borderRadius: 24,
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	socialContainer: {
		marginTop: 24,
		gap: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	formContainer: {
		marginTop: 24,
		flexDirection: 'column',
		gap: 12,
	},
	input: {
		backgroundColor: theme.input,
		color: theme.text,
		borderRadius: 8,
		fontSize: 16,
		paddingHorizontal: 16,
		paddingVertical: 24,
	},
}))
