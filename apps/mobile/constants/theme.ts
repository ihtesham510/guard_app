/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native'

// constants/theme.ts
export const Colors = {
	light: {
		text: '#11181C',
		background: '#fff',
		tint: '#0a7ea4',
		icon: '#687076',
		tabIconDefault: '#687076',
		tabIconSelected: '#0a7ea4',
		primary: '#0a7ea4',
		primaryForeground: '#fff',
		secondary: '#f1f5f9',
		secondaryForeground: '#0f172a',
		muted: '#f1f5f9',
		mutedForeground: '#64748b',
		accent: '#f1f5f9',
		accentForeground: '#0f172a',
		destructive: '#ef4444',
		destructiveForeground: '#fff',
		border: '#e2e8f0',
		input: '#e2e8f0',
		ring: '#0a7ea4',
		card: '#fff',
		cardForeground: '#11181C',
		popover: '#fff',
		popoverForeground: '#11181C',
	},
	dark: {
		text: '#ECEDEE',
		background: '#151718',
		tint: '#fff',
		icon: '#9BA1A6',
		tabIconDefault: '#9BA1A6',
		tabIconSelected: '#fff',
		primary: '#38bdf8',
		primaryForeground: '#0f172a',
		secondary: '#1e293b',
		secondaryForeground: '#f8fafc',
		muted: '#1e293b',
		mutedForeground: '#94a3b8',
		accent: '#1e293b',
		accentForeground: '#f8fafc',
		destructive: '#7f1d1d',
		destructiveForeground: '#fef2f2',
		border: '#1e293b',
		input: '#1e293b',
		ring: '#38bdf8',
		card: '#1c1c1e',
		cardForeground: '#ECEDEE',
		popover: '#1c1c1e',
		popoverForeground: '#ECEDEE',
	},
}

export type Theme = typeof Colors.light

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'ui-rounded',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
})
