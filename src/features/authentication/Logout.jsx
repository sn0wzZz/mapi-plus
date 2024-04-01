import ButtonIcon from '../../ui/ButtonIcon'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useLogout } from './useLogout'
import { useUserContext } from '../../contexts/UserContext'
import { useMapContext } from '../../contexts/MapContext'

export default function Logout() {
  const { variant } = useDarkMode()
  const { setAccontPanelVisible } = useUserContext()
  const { clearRoute } = useMapContext()
  const { logout, isPending } = useLogout()
  return (
    <ButtonIcon
      iconName={'log-out-outline'}
      onPressFunction={() => {
        clearRoute()
        setAccontPanelVisible(false)
        logout()
      }}
      isLoading={isPending}
      disabled={isPending}
      color={variant.text}
      bgColor={variant.accent}
      underlay={variant.accentActive}
      size={18}
      style={'width: 30px; height: 30px;  top:4px; right: 4px;'}
      loaderColor={variant.text}
    />
  )
}
