import { SafeAreaView } from 'react-native'
import Spinner from './Spinner'
import styled from 'styled-components/native'
import { useDarkMode } from '../contexts/DarkModeContext'

const SplashBox = styled(SafeAreaView)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.variant.backgroundTrSolid};
`

export default function Splash() {
  const { variant } = useDarkMode()
  return (
    <SplashBox variant={variant}>
      <Spinner size={50} />
    </SplashBox>
  )
}
