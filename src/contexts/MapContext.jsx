import { useState, createContext, useContext, useRef } from 'react'
import { AnimatedRegion } from 'react-native-maps'
import { Vibration } from 'react-native'


const MapContext = createContext()

const MapProvider = ({ children }) => {
  const [animatedRegion, setAnimatedRegion] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.9,
      longitudeDelta: 0.9,
    })
  )
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.9,
    longitudeDelta: 0.9,
  })
  const [markers, setMarkers] = useState([])
  const [pin, setPin] = useState(null)
  const [data, setData] = useState([])
  const [locationType, setLocationType] = useState('location')
  const [locationName, setLocationName] = useState('')
  const [currentLocation, setCurrentLocation] = useState([])
  const [parkingLocation, setParkingLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isArrowVisible, setIsArrowVisible] = useState(false)
  const [search, setSearch] = useState(null)
  const [searchIsGeoCoords, setSearchIsGeoCoords] = useState(false)
  const [searchPinLocation, setSearchPinLocation] = useState(null)
  

  const vibrate = () => Vibration.vibrate(50, false)
  const inputRef = useRef(null)

  const value = {
    animatedRegion,
    setAnimatedRegion,
    markers,
    setMarkers,
    pin,
    setPin,
    data,
    setData,
    inputRef,
    locationType,
    setLocationType,
    locationName,
    setLocationName,
    currentLocation,
    setCurrentLocation,
    isLoading,
    setIsLoading,
    parkingLocation,
    setParkingLocation,
    currentRegion,
    setCurrentRegion,
    isArrowVisible,
    setIsArrowVisible,
    vibrate,
    search,
    setSearch,
    searchIsGeoCoords,
    setSearchIsGeoCoords,
    searchPinLocation,
    setSearchPinLocation,
  }
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined)
    throw new Error('MapContext was used outside of MapProvider')
  return context
}
export { MapProvider, useMapContext }
