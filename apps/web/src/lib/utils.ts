import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function generateEmployeeCode(prefixLength = 3, totalLength = 8): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const digits = '0123456789'

	let prefix = ''
	for (let i = 0; i < prefixLength; i++) {
		prefix += letters.charAt(Math.floor(Math.random() * letters.length))
	}
	const remainingLength = totalLength - prefixLength
	const pool = letters + digits
	let suffix = ''
	for (let i = 0; i < remainingLength; i++) {
		suffix += pool.charAt(Math.floor(Math.random() * pool.length))
	}

	return prefix + suffix
}
