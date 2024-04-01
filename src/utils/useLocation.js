import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

const useLocation = () => {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    let isMounted = true

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
          console.error('Location permission not granted')
          return
        }

        const locationListener = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 1000 },
          (newLocation) => {
            if (isMounted) {
              const { latitude, longitude } = newLocation.coords
              setLocation({ latitude, longitude })
            }
          }
        )

        return () => {
          if (locationListener) {
            locationListener.remove()
          }
        }
      } catch (error) {
        console.error('Error getting location:', error)
      }
    }

    getLocation()

    return () => {
      isMounted = false
    }
  }, [])

  return location
}

export default useLocation
