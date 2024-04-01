import { Picker } from '@react-native-picker/picker'
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native'
import styled, { css } from 'styled-components'

import { useDarkMode } from '../../contexts/DarkModeContext'
import { useMapContext } from '../../contexts/MapContext'

import useMapOperations from '../../utils/useMapOperations'

import ButtonIcon from '../../ui/ButtonIcon'
import theme from '../../theme'
import useKeyboardVisibility from '../../utils/useKeyboardVisibility'
import { deviceHeight } from '../../utils/helpers'

import { items } from '../../misc'

const height = 0.09 * deviceHeight

const StyledActionForm = styled(View)`
  position: absolute;
  bottom: 12px;
  padding: 10px 7.5px;
  background-color: ${(props) => props.variant.background};
  z-index: 99999;
  flex: 1;
  flex-direction: row;
  gap: 5px;
  height: ${height}px;
  width: 95%;
  align-items: center;
  justify-content: flex-start;
  border-radius: ${theme.radiuses.lg};
  /* border-radius: ${theme.radiuses.md} ${theme.radiuses.md} 0 0; */
`

const InputBox = styled(View)`
  height: 50px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  background: ${(props) => props.variant.underlay};
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
  width: 60%;
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
`

const ErrorMessage = styled(Text)`
  position: absolute;
  width: 100%;
  bottom: 0px;
  left: 7.5px;
  opacity: ${(props) => (props.errorInsert ? '1' : '0')};
  font-size: 10px;
  color: tomato;
  text-align: left;
  padding: 2px 11px;
`

export default function ActionForm({
  isGeoCoord,
  searchPin,
  handleCloseModal,
  handleSaveLocation,
  errorInsert,
  setShowOnMapClicked,
  setIsLoadingSave,
  isLoadingSave,
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

  const isKeyboardVisible = useKeyboardVisibility()
  // console.log('Is keyboard visible:', isKeyboardVisible)

  const handelShow = () => {
    setSearchPinLocation(searchPin)
    animateToSpecificLocation(searchPin)
    setShowOnMapClicked(true)
  }
  return (
    <StyledActionForm variant={variant} isKeyboardVizible={isKeyboardVisible}>
      <InputBox variant={variant}>
        <InputField
          ref={inputRef}
          placeholder='Location name'
          placeholderTextColor={variant.textSecondary}
          value={locationName}
          onChangeText={setLocationName}
          onFocus={() => {
            setInputIsFocused(true)
          }}
        />
        {isLoadingSave && (
          <ActivityIndicator
            animating={isLoadingSave}
            color={theme.colors.accent}
            size={'small'}
            style={{ right: 15 }}
          />
        )}
        <StyledPicker
          selectedValue={locationType}
          mode='dropdown'
          dropdownIconColor={theme.colors.accent}
          onValueChange={(itemValue) => {
            setLocationType(itemValue)
          }}
        >
          {items.map((item, id) => (
            <Picker.Item key={id} label={item.label} value={item.value} />
          ))}
        </StyledPicker>
        {<ErrorMessage errorInsert={errorInsert}>{errorInsert}</ErrorMessage>}
      </InputBox>
      <Buttons>
        {isGeoCoord && (
          <ButtonIcon
            iconName='map'
            color={theme.colors.text}
            bgColor={theme.colors.accentSecondary}
            underlay={theme.colors.accentSecondaryActive}
            style={clearButton}
            onPressFunction={(e) => {
              handelShow(e)
            }}
          />
        )}
        <ButtonIcon
          iconName='save'
          color={theme.colors.text}
          style={clearButton}
          bgColor={variant.accent}
          underlay={variant.accentActive}
          onPressFunction={() => {
            handleSaveLocation()
          }}
        />
        <ButtonIcon
          iconName='close'
          color={theme.colors.text}
          style={clearButton}
          bgColor={theme.colors.error}
          underlay={theme.colors.errorActive}
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
              setCurrentLocation(null)
              Keyboard.dismiss()
            }
          }}
        />
      </Buttons>
    </StyledActionForm>
  )
}
