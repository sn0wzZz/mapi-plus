import { useEffect, useState } from 'react'
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
import { createLocation, getLocations } from '../../services/apiLocations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import useCreateLocation from '../list/useCreateLocation'

const MapContaioner = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
  position: relative;
`
const WIDTH = `${deviceWidth + 150}px`
const HEIGHT = `${deviceHeight + 150}px`

const StyledMapView = styled(MapView.Animated)`
  position: absolute;
  width: ${WIDTH};
  height: ${HEIGHT};
`

// eslint-disable-next-line no-unused-vars
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
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [isLoadingDirections, setIsLoadingDirections] = useState(false)
  const [searchIsActive, setSearchIsActive] = useState(false)
  const [routeDetails, setRouteDetails] = useState({ directions: [] })
  const [currentPosition, setCurrentPosition] = useState(null)
  const [heading,setHeading] =useState(0)
  const {createOnlineLocation,isLoadingOnline} = useCreateLocation()
  const [isDirectionsDetailsVisible, setIsDirectionsDetailsVisible] =
    useState(false)

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
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
  }, [isModalVisible, inputRef])

  useEffect(() => {
    if (locationName) setErrorInsert(null)
  }, [locationName])

  useEffect(() => {
    if (search) setSearchIsActive(true)
    else {
      setSearchResult(null)
      setSearchIsActive(false)
    }
  }, [search, setSearchResult])

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



  // console.log(currentLocation)

  const handleRegionChange = (newRegion) => {
    console.log("Region: ",newRegion)
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

  

  const handleSave = async () => {
    if (!currentLocation && !search) return
    const [latitude, longitude] = currentLocation || search.trim(' ').split(',')
    if (locationName === '' || locationType === '')
      return setErrorInsert('No name provided!')
    setIsLoadingSave(true)
    const info = await getInfo({ latitude, longitude })
    // console.log(
    //   'Data to be inserted',
    //   locationName,
    //   locationType,
    //   latitude,
    //   longitude,
    //   info
    // )
    insertData(locationName, locationType, latitude, longitude, info)
    createOnlineLocation({name:locationName, type: locationType, latitude, longitude, info})
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
    setCurrentLocation(null)
    setMarker(null)
    Keyboard.dismiss()
  }

  const handleGetLocation = () => {
    if (mapView.current) {
      mapView.current.getCamera().then((camera) => {
        console.log('Camera: ',camera)
      setHeading(camera.heading)    
      setCurrentPosition({
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
        })
      })
    }
  }

  // console.log('isLoadingSave:', isLoadingSave)

  return (
    <MapContaioner>
      <Search
        isModalVisible={isModalVisible}
        handleSave={handleSave}
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
          fromCoordinate={currentPosition}
          toCoordinate={pin.locationPin}
          heading={heading}
          onPress={goToPin}
        />
      )}

      {isModalVisible && (
        <ActionForm
          handleSave={handleSave}
          handleCloseModal={handleCloseModal}
          errorInsert={errorInsert}
          isLoadingSave={isLoadingSave || isLoadingOnline}
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
        onLongPressFunction={saveParked}
        bgColor={parked ? theme.colors.accent : null}
        bottom={'230px'}
        color={parked ? theme.colors.textWhite : theme.colors.accent}
        />
    </MapContaioner>
  )
}
