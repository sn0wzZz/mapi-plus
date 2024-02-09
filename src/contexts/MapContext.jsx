import { useState, createContext, useContext, useRef } from 'react'
import { Vibration } from 'react-native'

const MapContext = createContext()

const initialRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.9,
  longitudeDelta: 0.9,
}

const MapProvider = ({ children }) => {
  const [animatedRegion, setAnimatedRegion] = useState(initialRegion)
  const [currentRegion, setCurrentRegion] = useState(initialRegion)
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
  const [routeDetails, setRouteDetails] = useState({ directions: [] })

  const [isModalVisible, setModalVisible] = useState(false)
  const [parked, setParked] = useState(!parkingLocation)
  const [errorInsert, setErrorInsert] = useState(null)
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [isLoadingDirections, setIsLoadingDirections] = useState(false)
  const [searchIsActive, setSearchIsActive] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [heading, setHeading] = useState(0)
  
  const [isDirectionsDetailsVisible, setIsDirectionsDetailsVisible] =
    useState(false)

  const vibrate = () => Vibration.vibrate(50, false)
  const inputRef = useRef(null)
  const mapView = useRef(null)

  const clearRoute = () => {
    setRouteDetails({ directions: [], distance: null, duration: null })
    setDestination(null)
    setIsDirectionsDetailsVisible(false)
    setPin(null)
  }


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
    routeDetails,
    setRouteDetails,

    isModalVisible,
    setModalVisible,
    parked,
    setParked,
    errorInsert,
    setErrorInsert,
    isLoadingSave,
    setIsLoadingSave,
    isLoadingDirections,
    setIsLoadingDirections,
    searchIsActive,
    setSearchIsActive,
    currentPosition,
    setCurrentPosition,
    heading,
    setHeading,
    isDirectionsDetailsVisible,
    setIsDirectionsDetailsVisible,
    clearRoute
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
