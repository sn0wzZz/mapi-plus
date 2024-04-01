import { memo, useEffect, useState } from 'react'
import { View, Keyboard } from 'react-native'
import styled from 'styled-components/native'
import { deviceHeight, deviceWidth } from '../../utils/helpers'

// Maps
import MapView, { Polyline } from 'react-native-maps'

// Contexts
import { useMapContext } from '../../contexts/MapContext'
import { useDbContext } from '../../contexts/DbContext'
import { useDarkMode } from '../../contexts/DarkModeContext'

// Hooks
import useMapOperations from '../../utils/useMapOperations'

// Customization
import { DARK_MAP, LIGHT_MAP } from '../../mapStyles'

import Pin from '../../ui/Pin'
import theme from '../../theme'
import ButtonIcon from '../../ui/ButtonIcon'
import PointerArrow from '../../ui/PointerArrow'
import Compass from '../../ui/Compass'
import Search from '../../ui/Search'
import ActionForm from './ActionForm'
import useGeoCoding from '../../utils/useGeoCoding'
import RouteDetails from '../../ui/RouteDetails'
import useCreateLocation from '../list/useCreateLocation'
import useGetAllLocations from '../list/useGetAllLocations'
import useUser from '../authentication/useUser'
import useCreateAssociation from './useCreateAssociation'
import useLocation from '../../utils/useLocation'
import { Chat } from '../chat/Chat'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useUserContext } from '../../contexts/UserContext'
import Toast from 'react-native-toast-message'

const MapContaioner = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
  position: relative;
`

const StyledMapView = styled(MapView.Animated)`
  position: absolute;
  width: ${deviceWidth + 150}px;
  height: ${deviceHeight + 165}px;
`

// eslint-disable-next-line no-unused-vars
function MapScreen({ navigation }) {
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
    isArrowVisible,
    setIsArrowVisible,
    vibrate,
    search,
    setSearch,
    searchPinLocation,
    setInputIsFocused,
    setLocationInfo,
    destination,
    mapView,
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
    setCalloutIsPressed,
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
  const { createOnlineLocation } = useCreateLocation()

  // Init app
  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      await initLocation()
    })()
    animateToLocation()
    createTable()
    fetchData()
  }, [])

  // Open ActionForm
  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 50)
    }
  }, [isModalVisible, inputRef])

  // ActionForm error
  useEffect(() => {
    if (locationName) setErrorInsert(null)
  }, [locationName])

  // Search
  useEffect(() => {
    if (search) setSearchIsActive(true)
    else {
      setSearchResult(null)
      setSearchIsActive(false)
    }
  }, [search, setSearchResult])

  // Route and RouteDetails
  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      if (!destination) return
      setIsDirectionsDetailsVisible(true)
      setIsLoadingDirections(true)
      try {
        const { latitude, longitude } = await locationFetcher()
        // console.log('Destination:', destination, 'Origin:', latitude, longitude)
        const {
          distance: newDistance,
          directions: newDirections,
          duration: newDuration,
        } = await getDirections(
          { latitude: latitude, longitude: longitude },
          destination
        )
        // console.log('Directions', newDistance, newDirections, newDuration)
        setRouteDetails({
          distance: newDistance,
          directions: newDirections,
          duration: newDuration,
        })
      } catch (err) {
        // console.log('Fetching directions error:', err)
      } finally {
        setIsLoadingDirections(false)
      }
    })()
  }, [destination])

  ///////////////////////////////////////////////////////////////
  /////////////////////////CONSTRUCTION//////////////////////////
  ///////////////////////////////////////////////////////////////

  const { user, isFetching } = useUser()
  const { createAssociation } = useCreateAssociation()
  const { onlineData, isLoading: isLoadingAll } = useGetAllLocations()
  const location = useLocation()

  // 1. Keep track of user's current location
  // 2. If user's current location is near a saved location create an
  // association with userId and locationId

  const handleLocationChange = () => {
    if (!isLoadingAll && location && user) {
      const nearbyMarkers = onlineData.filter((marker) => {
        const { latitude: markerLat, longitude: markerLng } = marker
        const latDiff = Math.abs(location.latitude - markerLat)
        const lngDiff = Math.abs(location.longitude - markerLng)

        return latDiff < 0.001 && lngDiff < 0.001
      })

      if (nearbyMarkers.length > 0) {
        nearbyMarkers.forEach((marker) => {
          if (!marker.id || !user?.id) return
          const locationID = marker?.id

          const newAssociation = {
            profile_id: user?.id,
            location_id: locationID,
          }

          Toast.show({
            type: 'confirm',
            text1: `You're at ${marker.name}`,
            text2: 'Click here to tag yourself!',
            position: 'bottom',
            onPress: () => createAssociation(newAssociation),
          })
        })
      } else {
        console.log('No nearby markers')
      }
    }
  }

  useEffect(() => {
    handleLocationChange()
  }, [location, onlineData])

  ///////////////////////////////////////////////////////////////
  ////////////////////////////END////////////////////////////////
  ///////////////////////////////////////////////////////////////

  // ArrowPoiner
  const handleShowArrowPoiner = (newRegion) => {
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

  // Open AcrionForm
  const handleOpenModal = () => {
    setModalVisible(true)
  }

  // Close AcrionForm
  const handleCloseModal = () => {
    setErrorInsert(null)
    setCurrentLocation(null)
    setInputIsFocused(false)
    setModalVisible(false)
    setIsLoadingSave(false)
    setMarker(null)
    setSearch(null)
    setSearchResult(null)
    setLocationName('')
    setLocationType('Location 📍')
    Keyboard.dismiss()
  }

  // Save location
  const handleSaveLocation = async () => {
    if (!currentLocation && !search) return
    const [latitude, longitude] = currentLocation
    if (locationName === '' || locationType === '')
      return setErrorInsert('No name provided!')
    setIsLoadingSave(true)
    const info = await getInfo({ latitude, longitude })
    insertData(locationName, locationType, latitude, longitude, info)
    createOnlineLocation({
      name: locationName,
      type: locationType,
      latitude,
      longitude,
      info,
      publisher_id: user?.id,
    })
    fetchData()
    setLocationInfo(null)
    handleCloseModal()
  }

  // Add marker
  const handleAddMarker = (e) => {
    setMarker(e.nativeEvent.coordinate)
    animateToSpecificLocation(e.nativeEvent.coordinate)
    setCurrentLocation([
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude,
    ])
    handleOpenModal(e)
  }

  // Press marker
  const handleMarkerPress = (e) =>
    animateToSpecificLocation(e.nativeEvent.coordinate)

  // Save parking
  const handleSaveParking = async () => {
    vibrate()
    setParked(true)
    const { latitude, longitude } = await locationFetcher()
    if (!latitude || !longitude) return
    insertParkingData(latitude, longitude)
    setParkingLocation(null)
  }

  // Locate vehicle
  const locateParked = () => {
    fetchParkingData()
    if (!parkingLocation) return
    setParked(false)
    animateToSpecificLocation(parkingLocation, 0.003)
  }

  // Go to pin
  const goToPin = () => animateToSpecificLocation(pin.locationPin, 0.004)

  const mapPress = () => {
    if (isModalVisible) setModalVisible(false)
    // if (inputIsFocused) setInputIsFocused(false)
    // if (search) setSearch(null)
    setCurrentLocation(null)
    setMarker(null)
    Keyboard.dismiss()
  }

  // Get current location
  const handleGetLocation = () => {
    if (mapView.current) {
      mapView.current.getCamera().then((camera) => {
        // console.log('Camera: ',camera)
        setHeading(camera.heading)
        setCurrentPosition({
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
        })
      })
    }
  }

  return (
    <MapContaioner>
      <Search
        isModalVisible={isModalVisible}
        handleSaveLocation={handleSaveLocation}
        setCurrentLocation={setCurrentLocation}
        errorInsert={errorInsert}
        setIsLoadingSave={setIsLoadingSave}
        searchIsActive={searchIsActive}
        handleCloseModal={handleCloseModal}
      />

      <Compass />

      {isDirectionsDetailsVisible && (
        <RouteDetails
          routeDetails={routeDetails}
          searchIsActive={searchIsActive}
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
          handleShowArrowPoiner(region)
          handleGetLocation()
        }}
        tracksViewChanges={false}
        // liteMode={true}
        showsUserLocation={true}
        followsUserLocation={true}
        customMapStyle={isDarkMode ? DARK_MAP : LIGHT_MAP}
        provider={'google'}
        onMarkerPress={handleMarkerPress}
        onPress={mapPress}
        onLongPress={handleAddMarker}
        rotateEnabled={true}
        onCalloutPress={() => setCalloutIsPressed(true)}
      >
        <Polyline
          coordinates={routeDetails.directions}
          strokeColor={theme.colors.trail}
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
            locationId={pin.id}
            color={theme.colors.accentSecondary}
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
          fromCoordinate={currentPosition}
          toCoordinate={pin.locationPin}
          heading={heading}
          onPress={goToPin}
        />
      )}

      {isModalVisible && (
        <ActionForm
          handleSaveLocation={handleSaveLocation}
          handleCloseModal={handleCloseModal}
          errorInsert={errorInsert}
          isLoadingSave={isLoadingSave || isLoadingAll}
          setIsLoadingSave={setIsLoadingSave}
        />
      )}

      <ButtonIcon
        iconName={'locate'}
        onPressFunction={animateToLocation}
        bottom={'20px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'add'}
        onPressFunction={zoomIn}
        bottom={'90px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'remove'}
        onPressFunction={zoomOut}
        bottom={'160px'}
        color={theme.colors.accent}
      />
      <ButtonIcon
        iconName={'car-sport-outline'}
        onPressFunction={locateParked}
        onLongPressFunction={handleSaveParking}
        bgColor={parked ? theme.colors.accent : null}
        bottom={'230px'}
        color={parked ? theme.colors.text : theme.colors.accent}
      />
    </MapContaioner>
  )
}

export default memo(MapScreen)
