import { Picker } from '@react-native-picker/picker'
import {  SafeAreaView, Text, TextInput, View } from 'react-native'
import styled from 'styled-components'
import theme from '../../theme'

import { useDbMap } from '../../contexts/DbMap'
import { useDarkMode } from '../../contexts/DarkModeContext'

import ButtonText from '../../ui/ButtonText'
// import { BlurView } from '@react-native-community/blur'

const StyledForm = styled(SafeAreaView)`
  /* position: absolute; */
  background: ${props=> props.variant.background };
  /* background-color: red; */
  padding: 20px 15px;
  width: 100%;
  border-radius: ${theme.radiuses.md};
  margin-block: 15px;
`
const Input = styled(TextInput)`
  padding: 5px 10px;
  border-width: 2px;
  border-color: ${theme.colors.accent};
  border-radius: ${theme.radiuses.full};
  color: ${theme.colors.accent};
`
const StyledPicker = styled(Picker)`
  padding: 5px 10px;
  border-width: 2px;
  border-color: ${theme.colors.background};
  border-radius: ${theme.radiuses.full};
  color: ${theme.colors.accent};
`
const ErrorMessage = styled(Text)`
  font-size: 12px;
  color: red;
  text-align: center;
  background-color: ${theme.colors.error};
  padding: 2px;
  margin-top: 7px;
  border-radius: ${theme.radiuses.xs};
`

const Buttons = styled(View)`
  /* display: flex; */
  /* flex: 1; */
  justify-content: space-around;
  flex-direction: row;
  width: 100%;
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

export default function Form({handleCloseModal, handleSave, errorInsert}) {
  const {
    inputRef,
    locationType,
    setLocationType,
    locationName,
    setLocationName,
  } = useDbMap()
  const {variant} = useDarkMode()
  return (
    <StyledForm variant={variant} blurType='light' blurAmount={10}>
      {/* <BlurView blurType='light' blurAmount={10}> */}

      <Input
        ref={inputRef}
        placeholder='Location name'
        placeholderTextColor={'grey'}
        value={locationName}
        onChangeText={setLocationName}
      />
      {errorInsert && <ErrorMessage>{errorInsert}</ErrorMessage>}
      <StyledPicker
        selectedValue={locationType}
        mode='dropdown'
        dropdownIconColor={theme.colors.accent}
        onValueChange={(itemValue, itemIndex) => {
          setLocationType(itemValue)
          console.log(locationType)
        }}
      >
        {items.map((item, id) => (
          <Picker.Item key={id} label={item.label} value={item.value} />
        ))}
      </StyledPicker>
      <Buttons>
        <ButtonText
          textStyle={'width:80px;'}
          variant='secondary'
          onPressFunction={handleCloseModal}
        >
          Cancel
        </ButtonText>
        <ButtonText
          textStyle={'width:80px;'}
          variant='primary'
          onPressFunction={handleSave}
        >
          Save
        </ButtonText>
      </Buttons>
      {/* </BlurView> */}
    </StyledForm>
  )
}
