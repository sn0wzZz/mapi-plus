import { useMapContext } from '../../contexts/MapContext'
import * as Location from 'expo-location'

export default function useMapOperations() {
  const { animatedRegion, setAnimatedRegion, mapView } = useMapContext()

  const locationFetcher = async () => {
    try {
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync()
      return { latitude, longitude }
    } catch (error) {
      console.error('Error fetching location:', error)
    }
  }

  const initLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return
      animateToLocation()
    } catch (error) {
      console.error('Error initializing location:', error)
    }
  }

  const animateToSpecificLocation = (coords, delta = 0.01) => {
    mapView.current.animateToRegion({
      ...coords,
      latitudeDelta: delta,
      longitudeDelta: delta,
    })
  }

  const animateToLocation = async () => {
    const { latitude, longitude } = await locationFetcher()
    mapView&&mapView.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    })
  }

  const zoomOut = () => {
    if (mapView.current) {
      const newRegion = {
        ...animatedRegion,
        latitudeDelta: animatedRegion.latitudeDelta * 2,
        longitudeDelta: animatedRegion.longitudeDelta * 2,
      }
      mapView.current.animateToRegion(newRegion, 500)
      setAnimatedRegion(newRegion)
    }
  }

  const zoomIn = () => {
    if (mapView.current) {
      const newRegion = {
        ...animatedRegion,
        latitudeDelta: animatedRegion.latitudeDelta / 2,
        longitudeDelta: animatedRegion.longitudeDelta / 2,
      }
      mapView.current.animateToRegion(newRegion, 500)
      setAnimatedRegion(newRegion)
    }
  }

  return {
    initLocation,
    animateToLocation,
    animateToSpecificLocation,
    zoomOut,
    zoomIn,
    locationFetcher,
  }
}
