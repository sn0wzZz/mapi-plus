import { useState } from 'react'

import { TextInput, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'

import { useMapContext } from '../contexts/MapContext'
import { useDarkMode } from '../contexts/DarkModeContext'

import useMapOperations from '../features/map/useMapOperations'

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

export default function Search({ isModalVisible, handleSave }) {
  const { variant } = useDarkMode()
  const {
    data,
    search,
    setSearch,
    searchIsGeoCoords,
    setSearchIsGeoCoords,
    setSearchPinLocation,
  } = useMapContext()
  const { animateToSpecificLocation } = useMapOperations()

  const [searchPin, setSearchPin] = useState(null)
  const [focused, setFocused] = useState(false)
  const [showOnMapClicked, setShowOnMapClicked] = useState(false)

  const checkSearch = (e) => {
    const value = e

    console.log(isGeoCoord(value))
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
          disabled={isModalVisible}
          placeholderTextColor={'grey'}
          onChangeText={(e) => {
            setSearch(e)
            checkSearch(e)
            setShowOnMapClicked(false)
          }}
          // onBlur={() => {
          //   setSearchIsGeoCoords(false)
          // }}
          onFocus={() => {
            checkSearch(search)
            setFocused(true)
          }}
        />
      </SearchContainer>

      {search && focused && !showOnMapClicked && (
        <SearchList variant={variant}>
          <List
            topOffset='130px'
            height={searchIsGeoCoords ? '60%' : '71%'}
            itemBg={variant.background}
            data={data.filter((el) =>
              el.name.toLowerCase().includes(search.toLowerCase())
            )}
          />
          {searchIsGeoCoords && (
            <ActionForm
              isGeoCoord={isGeoCoord}
              searchPin={searchPin}
              handleSave={handleSave}
              setShowOnMapClicked={setShowOnMapClicked}
            />
          )}
        </SearchList>
      )}
    </>
  )
}
