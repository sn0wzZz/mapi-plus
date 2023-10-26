import { Picker } from '@react-native-picker/picker'
import { Keyboard, Text, TextInput, View } from 'react-native'
import styled, { css } from 'styled-components'

import { useDarkMode } from '../../contexts/DarkModeContext'
import { useMapContext } from '../../contexts/MapContext'

import useMapOperations from './useMapOperations'

import ButtonIcon from '../../ui/ButtonIcon'

const StyledActionForm = styled(View)`
  position: absolute;
  bottom: 0;
  padding: 10px 5px;
  width: 100%;
  background-color: ${(props) => props.variant.background};
  z-index: 99999;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  /* align-items: center; */
  border-radius: ${theme.radiuses.sm} ${theme.radiuses.sm} 0 0;
`

const InputBox = styled(View)`
  flex: 1;
  flex-direction: row;
  width: 100%;
  background: rgba(40, 40, 40, 0.4);
  border-radius: ${theme.radiuses.full};
  overflow: hidden;
`

const InputField = styled(TextInput)`
  padding-horizontal: 10px;
  color: ${theme.colors.accent};
  max-width: 215px;
  width: 215px;
`

const StyledPicker = styled(Picker)`
  width: 45%;
  padding: 0;
  gap: 0;
  color: ${theme.colors.accent};
`

const Buttons = styled(View)`
  position: relative;
  flex: 1;
  flex-direction: row;
  gap: 10px;
`

const clearButton = css`
  position: none;
  width: 40px;
  height: 40px;
  right: none;
  top: none;
  justify-content: center;
`

const ErrorMessage = styled(Text)`
  opacity: ${(props) => (props.errorInsert ? '1' : '0')};
  font-size: 13px;
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
  setShowOnMapClicked
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
  } = useMapContext()
  const { animateToSpecificLocation } = useMapOperations()

  const handelShow = () => {
    setSearchPinLocation(searchPin)
    animateToSpecificLocation(searchPin)
    setShowOnMapClicked(true)
  }
  return (
    <StyledActionForm variant={variant}>
      <InputBox>
        <InputField
          ref={inputRef}
          placeholder='Location name'
          placeholderTextColor={'lightgrey'}
          value={locationName}
          onChangeText={setLocationName}
        />
        <StyledPicker
          selectedValue={locationType}
          mode='dropdown'
          dropdownIconColor={theme.colors.accent}
          style={{ padding: 0, margin: 0 }}
          onValueChange={(itemValue, itemIndex) => {
            setLocationType(itemValue)
            console.log(locationType)
          }}
        >
          {items.map((item, id) => (
            <Picker.Item
              key={id}
              label={item.label}
              value={item.value}
              style={{ padding: 0, margin: 0, gap: 0 }}
            />
          ))}
        </StyledPicker>
      </InputBox>
      {<ErrorMessage errorInsert={errorInsert}>{errorInsert}</ErrorMessage>}
      <Buttons>
        {isGeoCoord && (
          <ButtonIcon
            iconName='map'
            color={variant.textWhite}
            style={clearButton}
            onPressFunction={(e) => {
              handelShow(e)
            }}
          />
        )}
        <ButtonIcon
          iconName='save'
          color={variant.textWhite}
          style={clearButton}
          bgColor={theme.colors.accent}
          onPressFunction={() => {
            handleSave()
          }}
        />
        <ButtonIcon
          iconName='close'
          color={variant.textWhite}
          style={clearButton}
          bgColor={'tomato'}
          onPressFunction={() => {
            if (handleCloseModal) {
              handleCloseModal()
            } else {
              setSearch('')
              Keyboard.dismiss()
            }
          }}
        />
      </Buttons>
    </StyledActionForm>
  )
}
