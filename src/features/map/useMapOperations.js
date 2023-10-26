import AnimatedMapRegion from 'react-native-maps/lib/AnimatedRegion'
import {  useMapContext } from '../../contexts/MapContext'
import * as Location from 'expo-location'

export default function useMapOperations() {
  const { animatedRegion, setAnimatedRegion, setIsArrowVisible } = useMapContext()

  const locationFetcher = async () => {
    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({})
    return { latitude, longitude }
  }

  const initLocaton = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') return

    const { latitude, longitude } = await locationFetcher()

    setAnimatedRegion(
      new AnimatedMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      })
    )
  }

  const animateToSpecificLocation = (coords, delta = 0.01) => {
    animatedRegion
      .timing({
        ...coords,
        latitudeDelta: delta,
        longitudeDelta: delta,
        duration: 1000,
      })
      .start()
  }

  const animateToLocation = async (duration) => {
    const { latitude, longitude } = await locationFetcher()
    animatedRegion
      .timing({
        latitude,
        longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
        duration: duration,
      })
      .start()
  }

  const zoom = (delta) => {
    animatedRegion
      .timing({
        ...{
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        duration: 1000,
      })
      .start()
  }

  return {
    initLocaton,
    animateToLocation,
    animateToSpecificLocation,
    zoom,
    locationFetcher,
  }
}
