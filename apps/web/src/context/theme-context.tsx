import { useLocalStorage } from '@mantine/hooks'
import { createContext, type PropsWithChildren, useContext } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContext {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const themeContext = createContext<ThemeContext | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useLocalStorage<Theme>({ key: 'theme' })

	return <themeContext.Provider value={{ theme, setTheme }}>{children}</themeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(themeContext)
	if (!ctx) {
		throw new Error("Looks like you're using useTheme outside the ThemeProvider")
	}
	return ctx
}
