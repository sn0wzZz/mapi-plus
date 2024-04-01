import { ActivityIndicator, View } from 'react-native'
import { useDarkMode } from '../contexts/DarkModeContext'
import styled from 'styled-components/native'

const SpinnerBox = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 95%;
  color: ${(props) => props.variant.text};
`

export default function Spinner({ text, color, size = 22 }) {
  const { variant } = useDarkMode()
  color ? color : (color = variant.accent)

  return (
    <SpinnerBox variant={variant}>
      {text && <Text>{text}</Text>}
      <ActivityIndicator color={color} size={size} />
    </SpinnerBox>
  )
}
