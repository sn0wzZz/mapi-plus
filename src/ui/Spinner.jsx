import { ActivityIndicator, View } from 'react-native'
import { useDarkMode } from '../contexts/DarkModeContext'
import styled from 'styled-components/native'

const SpinnerBox = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  color: ${props=>props.variant.textWhite};
`

export default function Spinner({ text, color, size=22 }) {
  const { variant } = useDarkMode()
  color? color : color = variant.accent

  return (
    <SpinnerBox variant={variant}>
      {text && <Text>{text}</Text>}
      <ActivityIndicator color={color} size={size} />
    </SpinnerBox>
  )
}
