import React, { useEffect, createRef, useState } from 'react'
import { View, Dimensions, Keyboard } from 'react-native'
import styled from 'styled-components/native'

// Maps
import MapView, { AnimatedRegion, Polyline } from 'react-native-maps'

// Contexts
import { useMapContext } from '../../contexts/MapContext'
import { useDbContext } from '../../contexts/DbContext'
import { useDarkMode } from '../../contexts/DarkModeContext'

// Hooks
import useMapOperations from './useMapOperations'

// Customization
import { DARK_MAP, LIGHT_MAP } from '../../variables'

import Pin from '../../ui/Pin'
import theme from '../../theme'
import ButtonIcon from '../../ui/ButtonIcon'
import PointerArrow from '../../ui/PointerArrow'
import Compass from '../../ui/Compass'
import Search from '../../ui/Search'
import ActionForm from './ActionForm'
import useGeoCoding from './useGeoCoding'
import useKeyboardVisibility from '../../utils/useKeyboardVisibility'
import RouteDetails from '../../ui/RouteDetails'

const MapContaioner = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
  position: relative;
`
const WIDTH = `${Dimensions.get('window').width + 150}px`
const HEIGHT = `${Dimensions.get('window').height + 150}px`

const StyledMapView = styled(MapView.Animated)`
  position: absolute;
  width: ${WIDTH};
  height: ${HEIGHT};
`

export default function MapScreen({ navigation }) {
  const {
    locationType,
    setLocationType,
    locationName,
    setLocationName,
    setCurrentLocation,
    currentLocation,
    marker,
    setMarker,
    pin,
    animatedRegion,
    setAnimatedRegion,
    inputRef,
    parkingLocation,
    setParkingLocation,
    currentRegion,
    setCurrentRegion,
    isArrowVisible,
    setIsArrowVisible,
    vibrate,
    search,
    setSearch,
    searchPinLocation,
    inputIsFocused,
    setInputIsFocused,
    searchIsGeoCoords,
    locationInfo,
    setLocationInfo,
    destination,
    mapView,
    searchResult,
    setSearchResult,
  } = useMapContext()

  const {
    createTable,
    insertData,
    insertParkingData,
    fetchParkingData,
    fetchData,
  } = useDbContext()

  const {
    initLocation,
    animateToLocation,
    zoomIn,
    zoomOut,
    animateToSpecificLocation,
    locationFetcher,
  } = useMapOperations()

  const { getInfo, getDirections } = useGeoCoding()

  const { isDarkMode } = useDarkMode()

  const [isModalVisible, setModalVisible] = useState(false)
  const [parked, setParked] = useState(!parkingLocation)
  const [errorInsert, setErrorInsert] = useState(null)
  const [savedLocation, setSavedLocation] = useState(null)
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [isLoadingDirections, setIsLoadingDirections] = useState(false)
  const [isDirectionsDetailsVisible, setIsDirectionsDetailsVisible] =
    useState(false)
  const [searchIsActive, setSearchIsActive] = useState(false)
  const [routeDetails, setRouteDetails] = useState({ directions: [] })

  useEffect(() => {
    ;(async () => {
      await initLocation()
    })()
    animateToLocation()
    createTable()
    fetchData()
  }, [])

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 50)
    }
  }, [isModalVisible])

  useEffect(() => {
    if (locationName) setErrorInsert(null)
  }, [locationName])

  useEffect(() => {
    if (search) setSearchIsActive(true)
    else {
      setSearchResult(null)
      setSearchIsActive(false)
    }
  }, [search])

  useEffect(() => {
    ;(async () => {
      if (!destination) return
      setIsDirectionsDetailsVisible(true)
      setIsLoadingDirections(true)
      try {
        const { latitude, longitude } = await locationFetcher()
        console.log('destination', destination, 'origin', latitude, longitude)
        const {
          distance: newDistance,
          directions: newDirections,
          duration: newDuration,
        } = await getDirections(
          { latitude: latitude, longitude: longitude },
          destination
        )
        console.log('Directions', newDistance, newDirections, newDuration)
        setRouteDetails({
          distance: newDistance,
          directions: newDirections,
          duration: newDuration,
        })
      } catch (err) {
        console.log('Fetching directions error:', err)
      } finally {
        setIsLoadingDirections(false)
      }
    })()
  }, [destination])

  const handleRegionChange = (newRegion) => {
    const markerIsInCurrentRegion =
      newRegion.latitude >
        pin?.locationPin.latitude - newRegion.latitudeDelta / 2.75 &&
      newRegion.latitude <
        pin?.locationPin.latitude + newRegion.latitudeDelta / 2.75 &&
      newRegion.longitude >
        pin?.locationPin.longitude - newRegion.longitudeDelta / 2.75 &&
      newRegion.longitude <
        pin?.locationPin.longitude + newRegion.longitudeDelta / 2.75

    setIsArrowVisible(!markerIsInCurrentRegion)
  }

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setErrorInsert(null)
    setCurrentLocation(null)
    setSavedLocation(null)
    setInputIsFocused(false)
    setModalVisible(false)
    setIsLoadingSave(false)
    setMarker(null)
    setSearch(null)
    setSearchResult(null)
    setLocationName('')
    setLocationType('Location 📍')
    // Keyboard.dismiss()
  }

  const handleSave = async () => {
    if (!currentLocation && !search) return
    const [longitude, latitude] = currentLocation || search.trim(' ').split(',')
    if (locationName === '' || locationType === '')
      return setErrorInsert('No name provided!')
    setIsLoadingSave(true)
    const info = await getInfo({ latitude, longitude })
    console.log(
      'Data to be inserted',
      locationName,
      locationType,
      latitude,
      longitude,
      info
    )
    insertData(locationName, locationType, longitude, latitude, info)
    fetchData()
    setLocationInfo(null)
    handleCloseModal()
  }

  const handleAddMarker = (e) => {
    setMarker(e.nativeEvent.coordinate)
    animateToSpecificLocation(e.nativeEvent.coordinate)
    setCurrentLocation([
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude,
    ])
    handleOpenModal(e)
  }

  const handleMarkerPress = (e) =>
    animateToSpecificLocation(e.nativeEvent.coordinate)

  const saveParked = async () => {
    vibrate()
    setParked(true)
    const { latitude, longitude } = await locationFetcher()
    if (!latitude || !longitude) return
    insertParkingData(latitude, longitude)
    setParkingLocation(null)
  }

  const locateParked = () => {
    fetchParkingData()
    if (!parkingLocation) return
    setParked(false)
    animateToSpecificLocation(parkingLocation, 0.003)
  }

  const goToPin = () => {
    animateToSpecificLocation(pin.locationPin, 0.004)
  }

  const mapPress = () => {
    if (isModalVisible) setModalVisible(false)
    // if (inputIsFocused) setInputIsFocused(false)
    // if (search) setSearch(null)
    Keyboard.dismiss()
  }

  const [currentLocation2, setCurrentLocation2] = useState(null)

  const handleGetLocation = () => {
    if (mapView.current) {
      mapView.current.getCamera().then((camera) => {
        setCurrentLocation2({
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
        })
      })
    }
  }

  console.log('isLoadingSave:', isLoadingSave)

  return (
    <MapContaioner>
      <Search
        isModalVisible={isModalVisible}
        handleSave={handleSave}
        setCurrentLocation={setSavedLocation}
        setSavedLocation={setSavedLocation}
        errorInsert={errorInsert}
        setIsLoadingSave={setIsLoadingSave}
        searchIsActive={searchIsActive}
        handleCloseModal={handleCloseModal}
      />
      <Compass />
      {!searchIsActive && isDirectionsDetailsVisible && (
        <RouteDetails
          routeDetails={routeDetails}
          setRouteDetails={setRouteDetails}
          isLoadingDirections={isLoadingDirections}
          setIsDirectionsDetailsVisible={setIsDirectionsDetailsVisible}
        />
      )}

      <StyledMapView
        ref={mapView}
        initialRegion={animatedRegion}
        onRegionChangeComplete={(region) => {
          setAnimatedRegion(region)
          handleRegionChange(region)
          handleGetLocation()
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        customMapStyle={isDarkMode ? DARK_MAP : LIGHT_MAP}
        provider={'google'}
        onMarkerPress={handleMarkerPress}
        onPress={mapPress}
        onLongPress={handleAddMarker}
        rotateEnabled={true}
      >
        <Polyline
          coordinates={routeDetails.directions}
          strokeColor={theme.colors.accent}
          strokeColors={[
            '#7F0000',
            '#00000000',
            '#B24112',
            '#E5845C',
            '#238C23',
            '#7F0000',
          ]}
          strokeWidth={6}
        />
        {marker && (
          <Pin
            coordinate={marker}
            color={theme.colors.accent}
            iconName={'location'}
            iconSize={45}
          />
        )}

        {pin && (
          <Pin
            coordinate={pin.locationPin}
            color={theme.colors.secondaryAccent}
            name={pin.name}
            iconName={'location'}
            iconSize={45}
          />
        )}
        {parkingLocation && (
          <Pin
            coordinate={parkingLocation}
            color={theme.colors.accent}
            iconName={'car-sport'}
            name={'My car'}
            iconSize={30}
          />
        )}
        {searchPinLocation && (
          <Pin
            coordinate={searchPinLocation}
            color={'tomato'}
            iconName={'close'}
            name={'My car'}
            iconSize={30}
          />
        )}
      </StyledMapView>

      {pin && isArrowVisible && (
        <PointerArrow
          fromCoordinate={currentLocation2}
          toCoordinate={pin.locationPin}
          onPress={goToPin}
        />
      )}

      {isModalVisible && (
        <ActionForm
          handleSave={handleSave}
          handleCloseModal={handleCloseModal}
          errorInsert={errorInsert}
          isLoadingSave={isLoadingSave}
          setIsLoadingSave={setIsLoadingSave}
        />
      )}

      <ButtonIcon
        iconName={'locate'}
        onPressFunction={animateToLocation}
        top={'670px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'add'}
        onPressFunction={zoomIn}
        top={'600px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'remove'}
        onPressFunction={zoomOut}
        top={'530px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'car-sport-outline'}
        onPressFunction={locateParked}
        onLongPressFunction={saveParked}
        bgColor={parked ? theme.colors.accent : null}
        top={'460px'}
        color={parked ? theme.colors.textWhite : theme.colors.accent}
      />
    </MapContaioner>
  )
}
