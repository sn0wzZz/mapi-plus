import { View } from 'react-native'
import ButtonIcon from '../../ui/ButtonIcon'
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function ProfileLink({ link }) {
  const { variant } = useDarkMode()

  return (
    <View>
      <ButtonIcon
        url={link.url}
        color={variant.accent}
        bgColor={variant.backgroundTrSolid}
        style={'position: relative; right:0 ;'}
      />
    </View>
  )
}
