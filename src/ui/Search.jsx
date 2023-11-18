import { useEffect, useState } from 'react'

import { Keyboard, TextInput, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'

import { useMapContext } from '../contexts/MapContext'
import { useDarkMode } from '../contexts/DarkModeContext'

import List from './List'
import ActionForm from '../features/map/ActionForm'

const SearchContainer = styled(View)`
  position: absolute;
  top: 10px;
  left: 20px;
  flex: 1;
  flex-direction: row;
  background: ${(props) => props.variant.background};
  border-radius: ${theme.radiuses.full};
  padding: 12px;
  z-index: 9999;
`

const SearchBox = styled(TextInput)`
  font-size: 18px;
  padding-left: 10px;
  color: ${theme.colors.accent};
  max-width: 225px;
`

const SearchList = styled(View)`
  flex: 1;
  align-items: center;
  position: relative;
  width: 100%;
  height: 500px;
  z-index: 99;
  background: ${(props) => props.variant.overlay};
`

function isGeoCoord(inputString) {
  // Define a regular expression pattern that matches numeric values with optional decimal points
  const geoCoordPattern =
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/

  // Use the test() method to check if the input string matches the pattern
  return geoCoordPattern.test(inputString)
}

export default function Search({
  isModalVisible,
  handleSave,
  setSavedLocation,
  errorInsert,
}) {
  const { variant } = useDarkMode()
  const {
    data,
    search,
    setSearch,
    searchIsGeoCoords,
    setSearchIsGeoCoords,
    setSearchPinLocation,
    inputIsFocused,
    setInputIsFocused,
  } = useMapContext()

  const [searchPin, setSearchPin] = useState(null)
  const [showOnMapClicked, setShowOnMapClicked] = useState(false)
  const [isKyeboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    setIsKeyboardVisible(Keyboard.isVisible())
    // console.log(Keyboard.isVisible())
  }, [Keyboard.isVisible()])

  const checkSearch = (e) => {
    const value = e
    console.log(isGeoCoord(value), inputIsFocused, searchIsGeoCoords)
    if (isGeoCoord(value)) {
      setSearchIsGeoCoords(true)
      const [latitude, longitude] = value.trim(' ').split(',')
      const numLat = parseFloat(latitude)
      const numLng = parseFloat(longitude)
      setSearchPin({ latitude: numLat, longitude: numLng })
    } else {
      setSearchIsGeoCoords(false)
      return
    }
  }

  return (
    <>
      <SearchContainer variant={variant}>
        <Icon name='search' color={theme.colors.accent} size={23} />
        <SearchBox
          placeholder='Search...'
          value={search}
          editable={!isModalVisible}
          placeholderTextColor={'grey'}
          onChangeText={(e) => {
            setSearch(e)
            checkSearch(e)
            setShowOnMapClicked(false)
          }}
          onBlur={(e) => {
            setSearch(e._targetInst.memoizedProps.value)
            if (!search?.length) setInputIsFocused(false)
          }}
          onFocus={() => {
            checkSearch(search)
            setInputIsFocused(true)
          }}
        />
      </SearchContainer>

      {search && !showOnMapClicked && (
        <SearchList variant={variant}>
          <List
            setShowOnMapClicked={setShowOnMapClicked}
            topOffset='125px'
            height={searchIsGeoCoords ? '59%' : '71%'}
            itemBg={variant.background}
            data={data.filter((el) =>
              el.name.toLowerCase().includes(search.toLowerCase())
            )}
          />
        </SearchList>
      )}
      {searchIsGeoCoords && inputIsFocused && (
        <ActionForm
          isGeoCoord={isGeoCoord}
          searchPin={searchPin}
          handleSave={handleSave}
          errorInsert={errorInsert}
          setShowOnMapClicked={setShowOnMapClicked}
          setSavedLocation={setSavedLocation}
        />
      )}
    </>
  )
}
