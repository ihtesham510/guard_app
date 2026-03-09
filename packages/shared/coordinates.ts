export type Coordinates = [number, number]

export interface PolygonOverview {
	coordinates: Coordinates
	zoom: number
}

/*
 * returns a boolean value if the current coordiates are within polygon or in the given radius
 * the raduis is in kilo-meters by default
 * */
export function isInArea({
	coordiates,
	radius,
	polygon,
	point,
	radiusUnit = 'kilo-meters',
}: {
	coordiates: Coordinates
	polygon?: Array<Coordinates>
	point?: Coordinates
	radius?: number
	radiusUnit?: 'yard' | 'kilo-meters'
}): boolean {
	if (polygon) return isPointInPolygon(coordiates, polygon)

	if (radius && point) {
		if (radiusUnit === 'kilo-meters') {
			return isPointInRadius(coordiates, point, radius * 100)
		}
		if (radiusUnit === 'yard') {
			return isPointInRadius(coordiates, point, radius * 0.9144)
		}
	}
	return false
}

export function isPointInPolygon(point: Coordinates, polygon: Array<Coordinates>): boolean {
	const x = point[0]
	const y = point[1]
	let inside = false

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i]!
		const [xj, yj] = polygon[j]!

		const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

		if (intersect) inside = !inside
	}

	return inside
}

const EARTH_RADIUS_METERS = 6371000

function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180
}

export function getDistanceInMeters(point1: Coordinates, point2: Coordinates): number {
	const [lat1, lng1] = point1
	const [lat2, lng2] = point2

	const dLat = toRadians(lat2 - lat1)
	const dLng = toRadians(lng2 - lng1)

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	return EARTH_RADIUS_METERS * c
}

export function isPointInRadius(currentPoint: Coordinates, centerPoint: Coordinates, radiusInMeters: number): boolean {
	return getDistanceInMeters(currentPoint, centerPoint) <= radiusInMeters
}

export function generateCirclePolygon(center: Coordinates, radiusMetres: number, steps = 64): Array<Array<number>> {
	const [lng, lat] = center
	const earthRadius = 6371008.8
	const radiusRad = radiusMetres / earthRadius
	const latRad = (lat * Math.PI) / 180
	const lngRad = (lng * Math.PI) / 180

	const coords: Array<Array<number>> = []
	for (let i = 0; i <= steps; i++) {
		const angle = (i / steps) * 2 * Math.PI
		const pointLat = Math.asin(Math.sin(latRad) * Math.cos(radiusRad) + Math.cos(latRad) * Math.sin(radiusRad) * Math.cos(angle))
		const pointLng =
			lngRad +
			Math.atan2(Math.sin(angle) * Math.sin(radiusRad) * Math.cos(latRad), Math.cos(radiusRad) - Math.sin(latRad) * Math.sin(pointLat))
		coords.push([(pointLng * 180) / Math.PI, (pointLat * 180) / Math.PI])
	}
	return coords
}

export function getPolygonOverview(polygon: Coordinates[]): PolygonOverview {
	if (polygon.length === 0) {
		throw new Error('Polygon must contain at least one coordinate.')
	}

	const lats = polygon.map(([lat]) => lat)
	const lngs = polygon.map(([, lng]) => lng)

	const minLat = Math.min(...lats)
	const maxLat = Math.max(...lats)
	const minLng = Math.min(...lngs)
	const maxLng = Math.max(...lngs)

	const centerLat = (minLat + maxLat) / 2
	const centerLng = (minLng + maxLng) / 2

	const spanLat = maxLat - minLat
	const spanLng = maxLng - minLng
	const maxSpan = Math.max(spanLat, spanLng)

	const zoom = Math.floor(Math.log2(360 / maxSpan))

	return {
		coordinates: [centerLat, centerLng],
		zoom: Math.min(Math.max(zoom, 1), 20) * 0.95,
	}
}
