import { View } from 'react-native'
import Filter from '../../ui/Filter'
import styled from 'styled-components/native'
import ButtonIcon from '../../ui/ButtonIcon'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useUserContext } from '../../contexts/UserContext'

const OperationsBox = styled(View)`
  position: absolute;
  z-index: 999;
  bottom: 92.5px;
  left: 20px;
  width: 95%;
  display: flex;
  flex-direction: row;
`

export default function ListOperations() {
  const { variant } = useDarkMode()
  const { sorted, setSorted } = useUserContext()
  const { personalSort, setPesonalSort } = useUserContext()

  const handleSort = () => {
    setSorted((cur) => !cur)
  }
  const handlePersonalSort = () => {
    setPesonalSort((cur) => !cur)
  }

  return (
    <OperationsBox>
      <ButtonIcon
        onPressFunction={handleSort}
        iconName={'swap-vertical'}
        color={!sorted ? 'black' : variant.accent}
        bgColor={!sorted ? variant.accent : null}
        style={'position: relative; margin-right: 5px;'}
        size={20}
        bgSize={40}
      />
      <ButtonIcon
        onPressFunction={handlePersonalSort}
        iconName={'person'}
        color={personalSort ? 'black' : variant.accent}
        bgColor={personalSort ? variant.accent : null}
        style={'position: relative; margin: 0px;'}
        size={20}
        bgSize={40}
      />

      <Filter />
    </OperationsBox>
  )
}
