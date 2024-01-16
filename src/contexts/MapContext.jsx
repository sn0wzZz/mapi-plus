import { useState, createContext, useContext, useRef } from 'react'
import { Vibration } from 'react-native'


const MapContext = createContext()

const MapProvider = ({ children }) => {
  const [animatedRegion, setAnimatedRegion] = useState(
      {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.9,
      longitudeDelta: 0.9,
    }
  )
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.9,
    longitudeDelta: 0.9,
  })
  const [marker, setMarker] = useState(null)
  const [pin, setPin] = useState(null)
  const [data, setData] = useState([])
  const [locationType, setLocationType] = useState('Location 📍')
  const [locationName, setLocationName] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [parkingLocation, setParkingLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isArrowVisible, setIsArrowVisible] = useState(false)
  const [search, setSearch] = useState(null)
  const [searchIsGeoCoords, setSearchIsGeoCoords] = useState(false)
  const [searchPinLocation, setSearchPinLocation] = useState(null)
  const [locationInfo, setLocationInfo] = useState(null)
  const [destination, setDestination] = useState(null)
  const [inputIsFocused, setInputIsFocused] = useState(false)
  const [searchResult, setSearchResult] = useState([])

  const vibrate = () => Vibration.vibrate(50, false)
  const inputRef = useRef(null)
  const mapView = useRef(null)

  const value = {
    animatedRegion,
    setAnimatedRegion,
    marker,
    setMarker,
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
    inputIsFocused,
    setInputIsFocused,
    locationInfo,
    setLocationInfo,
    destination,
    setDestination,
    mapView,
    searchResult,
    setSearchResult,
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
