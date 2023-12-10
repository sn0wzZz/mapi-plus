import { useEffect, useState } from 'react'

import { ActivityIndicator, Keyboard, TextInput, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'

import { useMapContext } from '../contexts/MapContext'
import { useDarkMode } from '../contexts/DarkModeContext'

import List from './List'
import ActionForm from '../features/map/ActionForm'
import useGeoCoding from '../features/map/useGeoCoding'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'
import ButtonIcon from './ButtonIcon'

const SearchContainer = styled(View)`
  position: absolute;
  top: 10px;
  left: 20px;
  flex: 1;
  flex-direction: row;
  background: ${(props) => props.variant.backgroundTrSolid};
  border-radius: ${theme.radiuses.full};
  align-items: center;
  padding: 12px;
  z-index: 9999;
`

const SearchBox = styled(TextInput)`
  font-size: 18px;
  padding-left: 10px;
  color: ${theme.colors.accent};
  max-width: 215px;
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

function isAddress(input) {
  if (!input) return
  const addressRegex = /^[a-zA-Z0-9\s]+ \d+$/
  return addressRegex.test(input);
}

function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

// const capitalize = (str) =>
//   str.split(' ').map((str) => str.charAt(0).toUpperCase() + str.slice(1, str.length+1)).join(' ')
export default function Search({
  isModalVisible,
  handleSave,
  setSavedLocation,
  errorInsert,
  setIsLoadingSave,
  searchIsActive,
  handleCloseModal,
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
    searchResult,
    setSearchResult,
  } = useMapContext()

  const { getSuggestions, getAutocompleteResults } = useGeoCoding()

  const [searchPin, setSearchPin] = useState(null)
  const [showOnMapClicked, setShowOnMapClicked] = useState(false)

  const [isLoadingResult, setIsLoadingResult] = useState(false)

  const isKeyboardVisible = useKeyboardVisibility()
  console.log('Is keyboard visible: ', isKeyboardVisible)

  const debouncedGetSuggestions = debounce(async (queryStr) => {
    const result = await getAutocompleteResults(queryStr)
    setSearchResult(result)
  }, 500) // Adjust the delay as needed

  // const checkSearch = (e) => {
  //   const value = e
  //   console.log(isGeoCoord(value), inputIsFocused, searchIsGeoCoords)
  //   if (isGeoCoord(value)) {
  //     setSearchIsGeoCoords(true)
  //     const [latitude, longitude] = value.trim(' ').split(',')
  //     const numLat = parseFloat(latitude)
  //     const numLng = parseFloat(longitude)
  //     setSearchPin({ latitude: numLat, longitude: numLng })
  //   } else if (isAddress(value)) {
  //     const { number, name, city } = isAddress(value)

  //     console.log('Address components:', number, name, city)
  //     // const tempSearchList = debouncedGetCoords({ number, name, city })
  //     console.log(tempSearchList)
  //   } else {
  //     setSearchIsGeoCoords(false)
  //     return
  //   }
  // }

  // console.log('isAddress',isAddress(search))
  useEffect(() => {
    ;(async () => {
      console.log(
        'Search valuses:',
        isGeoCoord(search),
        isAddress(search),
        inputIsFocused,
        searchIsGeoCoords
      )
      if (isGeoCoord(search)) {
        setSearchIsGeoCoords(true)
        const [latitude, longitude] = search.trim(' ').split(',')
        const numLat = parseFloat(latitude)
        const numLng = parseFloat(longitude)
        setSearchPin({ latitude: numLat, longitude: numLng })
      } else  {
        setIsLoadingResult(true)
        debouncedGetSuggestions( search )
        setIsLoadingResult(false)
        setSearchIsGeoCoords(false)
      } 
    })()
  }, [search])

  console.log('Search result:', searchResult)

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
          <Icon name='close' color={!searchIsActive? 'transparent':theme.colors.accent} size={23} onPress={() => setSearch(null)} style={{zIndex: searchIsActive? 1: -9}} disabled={!searchIsActive}/>
        
      </SearchContainer>

      {search && !showOnMapClicked && (
        <SearchList variant={variant}>
          <List
            setShowOnMapClicked={setShowOnMapClicked}
            topOffset={searchResult ? '275px' : '125px'}
            height={
              isKeyboardVisible
                ? searchResult
                  ? searchIsGeoCoords
                    ? '24%'
                    : '42%'
                  : searchIsGeoCoords
                  ? '55%'
                  : '73%'
                : searchResult
                ? '51%'
                : '71%'
            }
            itemBg={variant.background}
            data={data.filter((el) =>
              el.name.toLowerCase().includes(search.toLowerCase())
            )}
            text={'Saved'}
          />
          {searchResult && (
            <List
            dataSort={false}
              setShowOnMapClicked={setShowOnMapClicked}
              topOffset='125px'
              height={searchIsGeoCoords ? '59%' : '71%'}
              itemBg={variant.background}
              data={searchResult}
              text={'Found'}
            />
          )}
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
          setIsLoadingSave={setIsLoadingSave}
        />
      )}
    </>
  )
}
