import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapMarker, MarkerContent, useMap } from '@/components/ui/map'

export function MapEventListner() {
	const { map, isLoaded } = useMap()
	const [coordinates, setCoordinates] = useState<Array<Array<number>>>([])
	const [current, setCurrent] = useState<[number, number]>([0, 0])

	const addLayers = useCallback(
		(postions: Array<Array<number>>) => {
			if (!map || !isLoaded) return
			if (!map.getSource('selected-areas')) {
				map.addSource('selected-areas', {
					type: 'geojson',
					data: {
						type: 'Polygon',
						coordinates: [postions],
					},
				})
			}

			if (!map.getLayer(`area-filled`)) {
				map.addLayer({
					id: `area-filled`,
					type: 'fill',
					source: `selected-areas`,
					paint: {
						'fill-color': '#393',
						'fill-opacity': 0.2,
					},
				})
			}
		},
		[map, isLoaded],
	)
	const removeLayer = useCallback(() => {
		if (!map || !isLoaded) return
		map.removeSource('selected-areas')
		map.removeLayer('area-filled')
		setCoordinates([])
	}, [map, isLoaded])

	useEffect(() => {
		if (!map || !isLoaded) return
		map.getCanvas().style.cursor = 'pointer'
		const handleClick = (e: maplibregl.MapMouseEvent) => {
			setCoordinates(prev => [...prev, [e.lngLat.lng, e.lngLat.lat]])
		}
		const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
			setCurrent([e.lngLat.lng, e.lngLat.lat])
		}

		map.on('click', handleClick)
		map.on('mousemove', handleMouseMove)

		return () => {
			map.off('click', handleClick)
			map.off('mousemove', handleMouseMove)
		}
	}, [map, isLoaded])

	function isPointInPolygon(point: Array<number>, polygon: Array<Array<number>>): boolean {
		const x = point[0],
			y = point[1]
		let inside = false

		for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			const xi = polygon[i][0],
				yi = polygon[i][1]
			const xj = polygon[j][0],
				yj = polygon[j][1]

			const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

			if (intersect) inside = !inside
		}

		return inside
	}

	return (
		<>
			{coordinates.map((cor, index) => (
				<MapMarker key={index} longitude={cor[0]} latitude={cor[1]} color='#114949'>
					<MarkerContent>
						<div className='size-4 rounded-full bg-primary border-2 border-white shadow-lg' />
					</MarkerContent>
				</MapMarker>
			))}
			<div className='absolute bottom-4 left-4 z-10 flex justify-center items-center gap-4'>
				<h1 className='text-3xl font-bold'>{isPointInPolygon(current, coordinates) ? 'is inside' : 'is outside'}</h1>
				<Button
					size='sm'
					onClick={() => {
						addLayers(coordinates)
					}}
				>
					select area
				</Button>
				<Button size='sm' onClick={() => removeLayer()}>
					reset
				</Button>
			</div>
		</>
	)
}
