import React, { useEffect, createRef, useState } from 'react'
import { View, Dimensions, Keyboard } from 'react-native'
import styled from 'styled-components/native'

// Maps
import MapView, { AnimatedRegion } from 'react-native-maps'

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
  } = useMapContext()

  const {
    createTable,
    insertData,
    fetchData,
    insertParkingData,
    fetchParkingData,
  } = useDbContext()

  const {
    initLocaton,
    animateToLocation,
    zoom,
    animateToSpecificLocation,
    locationFetcher,
  } = useMapOperations()

  const { isDarkMode } = useDarkMode()

  const [isModalVisible, setModalVisible] = useState(false)
  const [isMapDragging, setIsMapDragging] = useState(false)
  const [parked, setParked] = useState(!parkingLocation)
  const [errorInsert, setErrorInsert] = useState(null)
  const [savedLocation, setSavedLocation] = useState(null)

  useEffect(() => {
    createTable()
    ;(async () => {
      await initLocaton()
      fetchData()
      fetchParkingData()
    })()
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

  const onRegionChangeComplete = (newRegion) => {
    if (isMapDragging) {
      setCurrentRegion(newRegion)
      setAnimatedRegion(new AnimatedRegion(newRegion))
      setIsMapDragging(false)
    }
  }

  const onMapPanDrag = () => {
    setIsMapDragging(true)
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
    setMarker(null)
  }

  const handleSave = () => {
    if (!currentLocation && !search) return
    const [longitude, latitude] = currentLocation || search.trim(' ').split(',')
    if (locationName === '' || locationType === '')
      return setErrorInsert('No name provided!')
    console.log(
      'Data to be inserted',
      locationName,
      locationType,
      longitude,
      latitude
    )
    insertData(locationName, locationType, longitude, latitude)
    setLocationName('')
    setLocationType('Location')
    fetchData()
    setSearch(null)
    setMarker(null)
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

  const mapView = createRef(null)

  return (
    <MapContaioner>
      <Search
        isModalVisible={isModalVisible}
        handleSave={handleSave}
        setCurrentLocation={setSavedLocation}
        setSavedLocation={setSavedLocation}
        errorInsert={errorInsert}
      />
      <Compass />

      <StyledMapView
        ref={mapView}
        region={animatedRegion}
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={handleRegionChange}
        showsUserLocation={true}
        followsUserLocation={true}
        customMapStyle={isDarkMode ? DARK_MAP : LIGHT_MAP}
        provider={'google'}
        onPanDrag={onMapPanDrag}
        onMarkerPress={handleMarkerPress}
        onPress={mapPress}
        onLongPress={handleAddMarker}
        rotateEnabled={true}
      >
        {marker &&(
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
          fromCoordinate={currentRegion}
          toCoordinate={pin.locationPin}
          onPress={goToPin}
        />
      )}

      {isModalVisible && (
        <ActionForm
          handleSave={handleSave}
          handleCloseModal={handleCloseModal}
          errorInsert={errorInsert}
        />
      )}

      <ButtonIcon
        iconName={'locate'}
        onPressFunction={async () => await animateToLocation(1000)}
        top={'670px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'add'}
        onPressFunction={() => zoom(0.002)}
        top={'600px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'remove'}
        onPressFunction={() => zoom(0.01)}
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
