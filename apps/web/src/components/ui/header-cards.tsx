import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'
import type React from 'react'
import type { PropsWithChildren } from 'react'
import { AnimatedText } from '@/components/ui/animated-text'
import { cn } from '@/lib/utils'

const cardVariants = {
	outline: 'border text-card-foreground rounded-lg p-6 shadow-sm',
	ghost: 'p-6',
}

const trendVariants = {
	up: 'text-green-600 dark:text-green-500 bg-green-600/10 dark:bg-green-500/10',
	down: 'text-red-600 dark:text-red-500 bg-red-600/10 dark:bg-red-500/10',
}

export function OverViewCardGroup({ children, className }: PropsWithChildren & { className?: string }) {
	return <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>{children}</div>
}

export function OverViewCard({
	children,
	variant = 'outline',
	className,
}: PropsWithChildren & {
	className?: string
	variant?: 'outline' | 'ghost'
}) {
	return <div className={cn(cardVariants[variant], className)}>{children}</div>
}

OverViewCard.Header = function OverviewCardHeader({ children, className }: PropsWithChildren & { className?: string }) {
	return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>
}

OverViewCard.Title = function OverviewCardTitle({
	children,
	icon: Icon,
	className,
}: PropsWithChildren & {
	className?: string
	icon?: React.ElementType
}) {
	return (
		<div className={cn('flex items-center gap-2', className)}>
			{Icon && <Icon className='h-5 w-5 text-muted-foreground' />}
			<h3 className='font-medium text-muted-foreground text-sm'>{children}</h3>
		</div>
	)
}

OverViewCard.Trend = function OverviewCardTrend({
	children,
	trend = 'up',
	className,
}: PropsWithChildren & {
	className?: string
	trend?: 'up' | 'down'
}) {
	const Icon = trend === 'up' ? TrendingUp : TrendingDown

	return (
		<div className={cn('flex items-center gap-1 rounded px-2 py-1 font-medium text-xs', trendVariants[trend], className)}>
			<Icon className='h-3 w-3' />
			<span>{children}</span>
		</div>
	)
}

OverViewCard.Value = function OverviewCardValue({ value, className }: { className?: string; value: string | number }) {
	return (
		<AnimatedText
			className={cn('font-bold text-3xl text-foreground', className)}
			animationType='words'
			staggerDelay={0.1}
			duration={0.6}
			text={String(value)}
		/>
	)
}

OverViewCard.Subtitle = function OverviewCardSubtitle({
	children,
	icon: Icon,
	className,
}: PropsWithChildren & {
	className?: string
	icon?: LucideIcon
}) {
	return (
		<div className={cn('mt-2 flex items-center gap-2 text-muted-foreground text-sm', className)}>
			{Icon && <Icon className='h-4 w-4' />}
			<span>{children}</span>
		</div>
	)
}

OverViewCard.Description = function OverviewCardDescription({
	children,
	className,
}: PropsWithChildren & {
	className?: string
}) {
	return <p className={cn('mt-1 text-muted-foreground text-sm', className)}>{children}</p>
}

OverViewCard.Footer = function OverviewCardFooter({
	children,
	className,
}: PropsWithChildren & {
	className?: string
}) {
	return <div className={cn('mt-4 text-muted-foreground text-xs', className)}>{children}</div>
}

OverViewCard.Badge = function OverviewCardBadge({
	children,
	className,
	variant = 'default',
}: PropsWithChildren & {
	className?: string
	variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
	const variants = {
		default: 'bg-secondary text-secondary-foreground',
		success: 'bg-green-600/10 text-green-600 dark:bg-green-500/10 dark:text-green-500',
		warning: 'bg-yellow-600/10 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500',
		danger: 'bg-destructive/10 text-destructive',
	}

	return (
		<span className={cn('inline-flex items-center rounded px-2 py-1 font-medium text-xs', variants[variant], className)}>{children}</span>
	)
}
