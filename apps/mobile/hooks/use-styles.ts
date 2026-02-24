// hooks/use-styles.ts
import { useMemo } from 'react'
import { type ImageStyle, StyleSheet, type TextStyle, type ViewStyle } from 'react-native'
import { Colors, type Theme } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>

// The trick: constrain T at createStyles so the return type is locked immediately
export function createStyles<T extends NamedStyles>(factory: (theme: Theme) => T): (theme: Theme) => T {
	return factory
}

export function useStyles<T extends NamedStyles>(factory: (theme: Theme) => T): { styles: T; theme: Theme } {
	const scheme = useColorScheme() ?? 'light'
	const theme = Colors[scheme]

	const styles = useMemo(() => StyleSheet.create(factory(theme)) as unknown as T, [factory, theme])

	return { styles, theme }
}
