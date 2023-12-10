import { Picker } from '@react-native-picker/picker'
import { ActivityIndicator, Keyboard, Text, TextInput, View } from 'react-native'
import styled, { css } from 'styled-components'

import { useDarkMode } from '../../contexts/DarkModeContext'
import { useMapContext } from '../../contexts/MapContext'

import useMapOperations from './useMapOperations'

import ButtonIcon from '../../ui/ButtonIcon'

const StyledActionForm = styled(View)`
  position: absolute;
  bottom: 0;
  padding: 10px 7.5px;
  /* width: 100%; */
  background-color: ${(props) => props.variant.backgroundTrSolid};
  z-index: 99999;
  flex: 1;
  flex-direction: row;
  gap:5px;
  height: 95px;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  border-radius: ${theme.radiuses.md} ${theme.radiuses.md} 0 0;
  /* padding-bottom: ${props=> props.focused? '10px':'100px'}; */
  `

const InputBox = styled(View)`
  height: 50px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  /* width: 100%; */
  background: ${(props) => props.variant.overlay};
  z-index: 99999;
  border-radius: ${theme.radiuses.full};
  overflow: hidden;
  position: relative;
`

const InputField = styled(TextInput)`
  padding-horizontal: 10px;
  height: 50px;
  color: ${theme.colors.accent};
  max-width: 215px;
  width:60%;
`

const StyledPicker = styled(Picker)`
  width: 205px;
  margin-left: -20px;
  height: 50px;
  gap: 0;
  color: ${theme.colors.accent};
  
`

const Buttons = styled(View)`
  flex-direction: row;
  margin-left: auto;
  gap: 5px;
`

const clearButton = css`
  position: none;
  width: 40px;
  height: 40px;
  max-width: 40px;
  right: none;
  top: none;
  display: inline-block;
  /* float: inline-end; */
  /* justify-content: center; */
`

const ErrorMessage = styled(Text)`
  position: absolute;
  width:100%;
  bottom:5px;
  left: 7.5px;
  opacity: ${(props) => (props.errorInsert ? '1' : '0')};
  font-size: 10px;
  color: red;
  text-align: left;
  /* background-color: ${theme.colors.error}; */
  padding: 2px 11px;
  border-radius: ${theme.radiuses.full};
`

const items = [
  {
    label: 'Location 📍',
    value: 'location 📍',
  },
  {
    label: 'Secret Location 🔐',
    value: 'secret location 🔐',
  },
  {
    label: 'Parking 🚘',
    value: 'parking 🚘',
  },
  {
    label: 'Fitness & Health 💪',
    value: 'fitness & Health 💪',
  },
]

export default function ActionForm({
  isGeoCoord,
  searchPin,
  handleCloseModal,
  handleSave,
  errorInsert,
  setShowOnMapClicked,
  setSavedLocation,
  setIsLoadingSave,
  isLoadingSave
}) {
  const { variant } = useDarkMode()
  const {
    setSearch,
    setSearchPinLocation,
    locationType,
    setLocationType,
    locationName,
    setLocationName,
    inputRef,
    setInputIsFocused,
    setSearchIsGeoCoords,
    setCurrentLocation,
  } = useMapContext()
  const { animateToSpecificLocation } = useMapOperations()

  const handelShow = () => {
    setSearchPinLocation(searchPin)
    animateToSpecificLocation(searchPin)
    setShowOnMapClicked(true)
  }
  return (
    <StyledActionForm variant={variant}>
      <InputBox variant={variant}>
        <InputField
          ref={inputRef}
          placeholder='Location name'
          placeholderTextColor={'lightgrey'}
          value={locationName}
          onChangeText={setLocationName}
          onFocus={() => {
            setInputIsFocused(true)
          }}
        />
          {isLoadingSave&&<ActivityIndicator animating={isLoadingSave} color={theme.colors.accent} size={'small'} style={{right: 15}}/>}
        <StyledPicker
          selectedValue={locationType}
          mode='dropdown'
          dropdownIconColor={theme.colors.accent}
          onValueChange={(itemValue, itemIndex) => {
            setLocationType(itemValue)
          }}
        >
          {items.map((item, id) => (
            <Picker.Item key={id} label={item.label} value={item.value} />
            ))}
        </StyledPicker>
      </InputBox>
      {<ErrorMessage errorInsert={errorInsert}>{errorInsert}</ErrorMessage>}
      <Buttons>
        {isGeoCoord && (
          <ButtonIcon
            iconName='map'
            color={theme.colors.textWhite}
            bgColor={theme.colors.secondaryAccent}
            style={clearButton}
            onPressFunction={(e) => {
              handelShow(e)
            }}
          />
        )}
        <ButtonIcon
          iconName='save'
          color={theme.colors.textWhite}
          style={clearButton}
          bgColor={theme.colors.accent}
          onPressFunction={() => {
            handleSave()
          }}
        />
        <ButtonIcon
          iconName='close'
          color={theme.colors.textWhite}
          style={clearButton}
          bgColor={'tomato'}
          onPressFunction={() => {
            if (handleCloseModal) {
              handleCloseModal()
              setSearchIsGeoCoords(false)
            } else {
              setSearch('')
              setLocationName('')
              setLocationType('Location 📍')
              setIsLoadingSave(false)
              setInputIsFocused(false)
              setSearchIsGeoCoords(false)
              setSavedLocation(null)
              setCurrentLocation(null)
              Keyboard.dismiss()
            }
          }}
        />
      </Buttons>
    </StyledActionForm>
  )
}
