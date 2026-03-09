import { zodResolver } from '@hookform/resolvers/zod'
import type { LocationSchema } from '@repo/backend/schema'
import { type Coordinates, generateCirclePolygon } from '@repo/shared'
import { Check, Crosshair, MapPin, Pentagon, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { FieldLegend, FieldSet } from '@/components/ui/field'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MapControls, MapMarker, MapPopup, MarkerContent, useMap } from '@/components/ui/map'

interface Props {
	onSelect?: (cor: LocationSchema) => void
	value?: LocationSchema
}

type Action =
	| {
			type: 'set-area'
			polygon: Array<Coordinates>
	  }
	| {
			type: 'add-coordinates'
			coordinates: Coordinates
	  }
	| {
			type: 'set-current'
			coordinates: Coordinates
	  }
	| {
			type: 'set-location'
			location: Coordinates
			radius: number
	  }
	| {
			type: 'reset-area'
	  }
	| {
			type: 'reset-location'
	  }
	| {
			type: 'set-hasSelected'
			hasSelected: boolean
	  }
	| {
			type: 'set-selecting'
			selecting?: 'location' | 'area'
	  }

type State = {
	location: LocationSchema | undefined
	current: Coordinates | undefined
	hasSelected: boolean
	selecting?: 'location' | 'area'
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'set-area': {
			return {
				...state,
				location: {
					polygon: action.polygon,
				},
			}
		}
		case 'set-location': {
			return {
				...state,
				location: {
					radius: action.radius,
					coordinates: action.location,
				},
			}
		}
		case 'set-current': {
			return {
				...state,
				current: action.coordinates,
			}
		}
		case 'reset-location': {
			return {
				...state,
				location: undefined,
				hasSelected: false,
			}
		}
		case 'reset-area': {
			return {
				...state,
				location: undefined,
				hasSelected: false,
			}
		}
		case 'add-coordinates': {
			if (state.location) {
				if ('polygon' in state.location) {
					return {
						...state,
						location: {
							polygon: [...state.location.polygon, action.coordinates],
						},
					}
				}
			}
			return {
				...state,
				location: {
					polygon: [action.coordinates],
				},
			}
		}
		case 'set-hasSelected': {
			return { ...state, hasSelected: action.hasSelected }
		}
		case 'set-selecting': {
			return {
				...state,
				selecting: action.selecting,
				location: undefined,
				hasSelected: false,
			}
		}
		default:
			return state
	}
}

function upsertRadiusLayer(map: maplibregl.Map, center: Coordinates, radiusMetres: number) {
	const circleCoords = generateCirclePolygon(center, radiusMetres)
	const source = map.getSource('selected-radius') as maplibregl.GeoJSONSource | undefined

	if (source) {
		source.setData({
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [circleCoords],
			},
			properties: {},
		})
	} else {
		map.addSource('selected-radius', {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [circleCoords],
				},
				properties: {},
			},
		})
	}

	if (!map.getLayer('radius-filled')) {
		map.addLayer({
			id: 'radius-filled',
			type: 'fill',
			source: 'selected-radius',
			paint: {
				'fill-color': '#2563eb',
				'fill-opacity': 0.15,
			},
		})
	}

	if (!map.getLayer('radius-outline')) {
		map.addLayer({
			id: 'radius-outline',
			type: 'line',
			source: 'selected-radius',
			paint: {
				'line-color': '#2563eb',
				'line-width': 2,
				'line-dasharray': [2, 1],
			},
		})
	}
}

function upsertPolygonLayer(map: maplibregl.Map, positions: Array<Array<number>>) {
	const source = map.getSource('selected-areas') as maplibregl.GeoJSONSource | undefined

	if (source) {
		source.setData({
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [positions],
			},
			properties: {},
		})
	} else {
		map.addSource('selected-areas', {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [positions],
				},
				properties: {},
			},
		})
	}

	if (!map.getLayer('area-filled')) {
		map.addLayer({
			id: 'area-filled',
			type: 'fill',
			source: 'selected-areas',
			paint: {
				'fill-color': '#393',
				'fill-opacity': 0.2,
			},
		})
	}

	if (!map.getLayer('area-outline')) {
		map.addLayer({
			id: 'area-outline',
			type: 'line',
			source: 'selected-areas',
			paint: {
				'line-color': '#393',
				'line-width': 2,
				'line-dasharray': [2, 1],
			},
		})
	}
}

export function MapAreaSelector({ onSelect, value }: Props) {
	const { map, isLoaded } = useMap()
	const [state, dispatch] = useReducer(reducer, {
		location: value,
		current: undefined,
		hasSelected: !!value,
		selecting: undefined,
	})

	useEffect(() => {
		if (value === undefined) return
		if (value !== state.location) {
			if ('polygon' in value) {
				dispatch({ type: 'set-area', polygon: value.polygon as Coordinates[] })
			} else {
				dispatch({
					type: 'set-location',
					location: value.coordinates as Coordinates,
					radius: value.radius,
				})
			}
			dispatch({ type: 'set-hasSelected', hasSelected: true })
		}
	}, [value, state.location])

	const addLayers = useCallback(
		(positions: Array<Array<number>>) => {
			if (!map || !isLoaded) return
			upsertPolygonLayer(map, positions)
		},
		[map, isLoaded],
	)

	const removeLayer = useCallback(() => {
		if (!map || !isLoaded) return
		if (map.getLayer('area-outline')) map.removeLayer('area-outline')
		if (map.getLayer('area-filled')) map.removeLayer('area-filled')
		if (map.getSource('selected-areas')) map.removeSource('selected-areas')
	}, [map, isLoaded])

	const removeRadiusLayer = useCallback(() => {
		if (!map || !isLoaded) return
		if (map.getLayer('radius-outline')) map.removeLayer('radius-outline')
		if (map.getLayer('radius-filled')) map.removeLayer('radius-filled')
		if (map.getSource('selected-radius')) map.removeSource('selected-radius')
	}, [map, isLoaded])

	useEffect(() => {
		if (!map || !isLoaded) return

		map.getCanvas().style.cursor = state.selecting && !state.hasSelected ? 'crosshair' : 'pointer'

		const handleClick = (e: maplibregl.MapMouseEvent) => {
			if (!state.selecting || state.hasSelected) return

			const coords: Coordinates = [e.lngLat.lng, e.lngLat.lat]

			if (state.selecting === 'area') {
				dispatch({ type: 'add-coordinates', coordinates: coords })
			} else if (state.selecting === 'location') {
				dispatch({
					type: 'set-location',
					location: coords,
					radius: 500,
				})
			}
		}

		map.on('click', handleClick)

		return () => {
			map.off('click', handleClick)
		}
	}, [map, isLoaded, state.selecting, state.hasSelected])

	useEffect(() => {
		if (!map || !isLoaded) return
		if (!state.location || !('polygon' in state.location)) return
		if (state.location.polygon.length < 2) return
		addLayers(state.location.polygon)
	}, [map, isLoaded, state.location, addLayers])

	useEffect(() => {
		if (!map || !isLoaded) return
		if (!state.location || !('coordinates' in state.location)) {
			removeRadiusLayer()
			return
		}
		const { coordinates, radius } = state.location
		upsertRadiusLayer(map, coordinates as Coordinates, radius)
	}, [map, isLoaded, state.location, removeRadiusLayer])

	const handleConfirmArea = useCallback(() => {
		if (!state.location || !('polygon' in state.location)) return
		const polygon = state.location.polygon
		if (polygon.length < 3) return
		addLayers(polygon)
		dispatch({ type: 'set-hasSelected', hasSelected: true })
		onSelect?.({ polygon })
	}, [state.location, addLayers, onSelect])

	const handleConfirmLocation = useCallback(() => {
		if (!state.location || !('coordinates' in state.location)) return
		dispatch({ type: 'set-hasSelected', hasSelected: true })
		onSelect?.(state.location)
	}, [state.location, onSelect])

	const handleResetArea = useCallback(() => {
		removeLayer()
		dispatch({ type: 'reset-area' })
	}, [removeLayer])

	const handleStartSelecting = useCallback(
		(mode: 'location' | 'area') => {
			removeLayer()
			dispatch({ type: 'set-selecting', selecting: mode })
		},
		[removeLayer],
	)

	const handleCancelSelecting = useCallback(() => {
		removeLayer()
		dispatch({ type: 'set-selecting', selecting: undefined })
	}, [removeLayer])

	const isSelectingLocation = state.selecting === 'location'
	const isSelectingArea = state.selecting === 'area'
	const hasPolygonPoints = state.location && 'polygon' in state.location && state.location.polygon.length > 0
	const canConfirmArea = state.location && 'polygon' in state.location && state.location.polygon.length >= 3
	const hasLocationPin = state.location && 'coordinates' in state.location

	return (
		<>
			<MapControls
				position='bottom-right'
				showZoom
				showCompass
				showLocate
				showFullscreen
				onLocate={cor =>
					dispatch({
						type: 'set-current',
						coordinates: [cor.longitude, cor.latitude],
					})
				}
			/>

			{state.location &&
				'polygon' in state.location &&
				state.location.polygon.map((cor, index) => (
					<MapMarker key={index} longitude={cor[0]} latitude={cor[1]} color='#114949'>
						<MarkerContent>
							<div className='size-4 rounded-full bg-blue-600 border border-white shadow-lg' />
						</MarkerContent>
					</MapMarker>
				))}

			{hasLocationPin && (
				<MapMarker
					longitude={(state.location as { coordinates: Coordinates; radius: number }).coordinates[0]}
					latitude={(state.location as { coordinates: Coordinates; radius: number }).coordinates[1]}
					color='#114949'
				>
					<MarkerContent>
						<div className='size-4 rounded-full bg-blue-600 border border-white shadow-lg' />
					</MarkerContent>
				</MapMarker>
			)}

			{state.current && (
				<MapMarker longitude={state.current[0]} latitude={state.current[1]}>
					<MarkerContent>
						<MapPin className='size-6 text-white shadow-lg' />
					</MarkerContent>
				</MapMarker>
			)}

			{!state.selecting && !state.hasSelected && (
				<div className='absolute bottom-4 left-4 z-10 flex items-center gap-2'>
					<Button
						size='sm'
						variant='outline'
						className='bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground gap-1.5'
						onClick={() => handleStartSelecting('location')}
					>
						<Crosshair className='size-3.5' />
						Pin location
					</Button>
					<Button
						size='sm'
						variant='outline'
						className='bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground gap-1.5'
						onClick={() => handleStartSelecting('area')}
					>
						<Pentagon className='size-3.5' />
						Draw area
					</Button>
				</div>
			)}

			{isSelectingLocation && !state.hasSelected && (
				<div className='absolute bottom-4 left-4 z-10 flex items-center gap-2'>
					<span className='text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border'>
						{hasLocationPin ? 'Pin placed — confirm or re-click to move' : 'Click map to place pin'}
					</span>
					{hasLocationPin && (
						<Button
							size='sm'
							className='bg-background text-foreground border-border border hover:bg-primary hover:text-primary-foreground gap-1.5'
							onClick={handleConfirmLocation}
						>
							<Check className='size-3.5' />
							Confirm
						</Button>
					)}
					{hasLocationPin && (
						<RadiusPopUp
							coordinates={(state.location as { coordinates: Coordinates; radius: number }).coordinates}
							defaultRadius={500}
							onSubmit={e => {
								dispatch({
									type: 'set-location',
									location: (
										state.location as {
											coordinates: Coordinates
											radius: number
										}
									).coordinates,
									radius: e,
								})
							}}
						/>
					)}
					<Button size='sm' variant='ghost' className='text-muted-foreground hover:text-foreground gap-1.5' onClick={handleCancelSelecting}>
						Cancel
					</Button>
				</div>
			)}

			{isSelectingArea && !state.hasSelected && (
				<div className='absolute bottom-4 left-4 z-10 flex items-center gap-2'>
					<span className='text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border'>
						{hasPolygonPoints
							? `${(state.location as { polygon: Coordinates[] }).polygon.length} point(s) — ${canConfirmArea ? 'ready to confirm' : 'need at least 3'}`
							: 'Click map to draw polygon'}
					</span>
					{canConfirmArea && (
						<Button
							size='sm'
							className='bg-background text-foreground border-border border hover:bg-primary hover:text-primary-foreground gap-1.5'
							onClick={handleConfirmArea}
						>
							<Check className='size-3.5' />
							Confirm
						</Button>
					)}
					{hasPolygonPoints && (
						<Button
							size='sm'
							variant='outline'
							className='bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground gap-1.5'
							onClick={handleResetArea}
						>
							<RotateCcw className='size-3.5' />
							Reset
						</Button>
					)}
					<Button size='sm' variant='ghost' className='text-muted-foreground hover:text-foreground gap-1.5' onClick={handleCancelSelecting}>
						Cancel
					</Button>
				</div>
			)}

			{state.hasSelected && (
				<div className='absolute bottom-4 left-4 z-10 flex items-center gap-2'>
					<span className='text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border'>
						{state.location && 'polygon' in state.location
							? `Area selected (${state.location.polygon.length} points)`
							: 'Location selected'}
					</span>
					<Button
						size='sm'
						variant='outline'
						className='bg-background text-foreground border-border hover:bg-destructive hover:text-destructive-foreground gap-1.5'
						onClick={() => {
							removeLayer()
							if (state.location && 'polygon' in state.location) {
								dispatch({ type: 'reset-area' })
							} else {
								dispatch({ type: 'reset-location' })
							}
						}}
					>
						<RotateCcw className='size-3.5' />
						Clear
					</Button>
				</div>
			)}
		</>
	)
}

function RadiusPopUp({
	defaultRadius,
	coordinates,
	onSubmit,
}: {
	coordinates: Coordinates
	defaultRadius: number
	onSubmit: (e: number) => void
}) {
	const [showPopup, setShowPopup] = useState(false)
	const schema = z.object({
		radius: z.number().min(10),
	})
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			radius: defaultRadius,
		},
	})
	function handleSubmit(values: z.infer<typeof schema>) {
		onSubmit(values.radius)
		setShowPopup(false)
	}
	return (
		<>
			{!showPopup && (
				<Button
					size='sm'
					className='bg-background text-foreground border-border border hover:bg-primary hover:text-primary-foreground gap-1.5'
					onClick={() => setShowPopup(true)}
				>
					Set Radius
				</Button>
			)}
			{showPopup && (
				<MapPopup
					longitude={coordinates[0]}
					latitude={coordinates[1]}
					onClose={() => setShowPopup(false)}
					closeButton
					focusAfterOpen={false}
					closeOnClick={false}
					className='w-62'
				>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
							<FieldSet className='space-y-4'>
								<FieldLegend>Set Radius (m)</FieldLegend>
								<FormField
									control={form.control}
									name='radius'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type='number'
													placeholder='Radius'
													value={Number(field.value)}
													onChange={e => field.onChange(Number(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
							<Button size='xs'>Submit</Button>
						</form>
					</Form>
				</MapPopup>
			)}
		</>
	)
}
