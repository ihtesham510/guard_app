/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native'

// constants/theme.ts
export const Colors = {
	light: {
		text: '#111827',
		background: '#ffffff',
		tint: '#d87943',
		icon: '#6b7280',
		tabIconDefault: '#6b7280',
		tabIconSelected: '#d87943',
		primary: '#d87943',
		primaryForeground: '#ffffff',
		secondary: '#527575',
		secondaryForeground: '#ffffff',
		muted: '#f3f4f6',
		mutedForeground: '#6b7280',
		accent: '#eeeeee',
		accentForeground: '#111827',
		destructive: '#ef4444',
		destructiveForeground: '#fafafa',
		border: '#e5e7eb',
		input: '#e5e7eb',
		ring: '#d87943',
		card: '#f7f7f7',
		cardForeground: '#111827',
		popover: '#ffffff',
		popoverForeground: '#111827',
	},
	dark: {
		text: '#c1c1c1',
		background: '#121212',
		tint: '#e78a53',
		icon: '#888888',
		tabIconDefault: '#888888',
		tabIconSelected: '#e78a53',
		primary: '#d8753b',
		primaryForeground: '#121113',
		secondary: '#b08b73',
		secondaryForeground: '#121113',
		muted: '#222222',
		mutedForeground: '#888888',
		accent: '#333333',
		accentForeground: '#c1c1c1',
		destructive: '#d12e2e',
		destructiveForeground: '#121113',
		border: '#222222',
		input: '#222222',
		ring: '#e78a53',
		card: '#242424',
		cardForeground: '#c1c1c1',
		popover: '#121113',
		popoverForeground: '#c1c1c1',
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
