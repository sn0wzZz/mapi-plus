import { useEffect, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'

import { useMapContext } from '../contexts/MapContext'
import { useDarkMode } from '../contexts/DarkModeContext'

import List from './List'
import ActionForm from '../features/map/ActionForm'
import useGeoCoding from '../utils/useGeoCoding'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'
import { debounce, deviceHeight } from '../utils/helpers'

const SearchContainer = styled(View)`
  position: absolute;
  top: 50px;
  left: 10px;
  flex: 1;
  flex-direction: row;
  /* background: #fff; */
  background: ${(props) => props.variant.background};
  border-radius: ${theme.radiuses.full};
  align-items: center;
  padding: 12px;
  overflow: hidden;
  z-index: 9999;
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

const SearchBox = styled(TextInput)`
  font-size: 18px;
  padding-left: 10px;
  color: ${theme.colors.accent};
  max-width: 215px;
`

function isGeoCoord(inputString) {
  const geoCoordPattern =
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
  return geoCoordPattern.test(inputString)
}

export default function Search({
  isModalVisible,
  handleSaveLocation,
  errorInsert,
  setIsLoadingSave,
  searchIsActive,
}) {
  const { variant } = useDarkMode()
  const {
    data,
    search,
    setSearch,
    searchIsGeoCoords,
    setSearchIsGeoCoords,
    setCurrentLocation,
    inputIsFocused,
    setInputIsFocused,
    searchResult,
    setSearchResult,
  } = useMapContext()

  const { getSuggestions } = useGeoCoding()

  const [searchPin, setSearchPin] = useState(null)
  const [showOnMapClicked, setShowOnMapClicked] = useState(false)

  const  isKeyboardVisible  = Keyboard.isVisible()
  // console.log('Is keyboard visible: ', isKeyboardVisible)

  const debouncedGetSuggestions = debounce(async (queryStr) => {
    const result = await getSuggestions(queryStr)
    // console.log(result)
    setSearchResult(result)
  }, 500) // Adjust the delay as needed

  useEffect(() => {
    // console.log(
    //   'Search valuses:',
    //   isGeoCoord(search),
    //   isAddress(search),
    //   inputIsFocused,
    //   searchIsGeoCoords
    // )

    if (isGeoCoord(search)) {
      setSearchIsGeoCoords(isGeoCoord(search))
      setCurrentLocation(null)
      const [latitude, longitude] = search.trim(' ').split(',')
      const numLat = parseFloat(latitude)
      const numLng = parseFloat(longitude)
      setSearchPin({ latitude: numLat, longitude: numLng })
    } else {
      setSearchIsGeoCoords(false)
      debouncedGetSuggestions(search)
    }
  }, [search])

  // console.log('Search result:', searchResult)
  // console.log('is Search geo:' , isGeoCoord(search))

  const finalData = (
    searchResult?.filter(
      (el) => !el?.name.toLowerCase().includes(search?.toLowerCase())
    ) || []
  ).concat(
    data?.filter((el) =>
      el?.name.toLowerCase().includes(search?.toLowerCase())
    ) || []
  )

  // console.log(finalData)
  
  return (
    <>
      <SearchContainer variant={variant}>
        <Icon name='search' color={theme.colors.accent} size={23} />
        <SearchBox
          placeholder='Search...'
          value={search}
          editable={!isModalVisible}
          placeholderTextColor={variant.textSecondary}
          onChangeText={(e) => {
            setSearch(e)
            // checkSearch(e)
            setShowOnMapClicked(false)
          }}
          onBlur={(e) => {
            setSearch(e._targetInst.memoizedProps.value)
            if (!search?.length) setInputIsFocused(false)
          }}
          onFocus={() => {
            // checkSearch(search)
            setInputIsFocused(true)
          }}
        />
        <Icon
          name='close'
          color={!searchIsActive ? 'transparent' : theme.colors.accent}
          size={23}
          onPress={() => setSearch(null)}
          style={{ zIndex: searchIsActive ? 1 : -9 }}
          disabled={!searchIsActive}
        />
      </SearchContainer>

      {search && !showOnMapClicked && (
        <SearchList variant={variant}>
          <List
            setShowOnMapClicked={setShowOnMapClicked}
            topOffset={`${deviceHeight * 0.215}px`}
            height={
              isKeyboardVisible ? (searchIsGeoCoords ? '51%' : '67%') : '70%'
            }
            itemBg={variant.background}
            data={finalData}
          />
        </SearchList>
      )}

      {searchIsGeoCoords && inputIsFocused && (
        <ActionForm
          isGeoCoord={isGeoCoord}
          searchPin={searchPin}
          handleSaveLocation={handleSaveLocation}
          errorInsert={errorInsert}
          setShowOnMapClicked={setShowOnMapClicked}
          setIsLoadingSave={setIsLoadingSave}
        />
      )}
    </>
  )
}
