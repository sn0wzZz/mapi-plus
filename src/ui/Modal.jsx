import { View } from 'react-native'
import styled from 'styled-components/native'
import { useDarkMode } from '../contexts/DarkModeContext'
import theme from '../theme'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useUserContext } from '../contexts/UserContext'
import { deviceHeight } from '../utils/helpers'
import { Platform } from 'react-native'

const ModalBox = styled(GestureHandlerRootView)`
  /* background: ${(props) => props.variant.overlay}; */
  position: absolute;
  padding: 10px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  /* left: 10px; */
  /* bottom: ${(props) => (props.isKeyboardVisible ? '20px' : '90px')}; */
  border-radius: ${theme.radiuses.lg};
`

export default function Modal({ children }) {
  const { variant } = useDarkMode()
  const { setUserPanelVisible } = useUserContext()
  const isKeyboardVisible = useKeyboardVisibility()

  const snapPoints = useMemo(() => ['50%'], [])
  const bottomSheetRef = useRef(null)

  const handleClosePress = () => bottomSheetRef.current?.close()
  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-7}
        appearsOnIndex={3}
      />
    ),
    []
  )

  return (
    <ModalBox isKeyboardVisible={isKeyboardVisible} variant={variant}>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        topInset={
          isKeyboardVisible
            ? Platform.Version === 33
              ? 90 % deviceHeight
              : 150 % deviceHeight
            : 0
        }
        index={0}
        keyboardBehavior='interactive'
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: variant.backgroundTrSolid }}
        handleIndicatorStyle={{ backgroundColor: variant.textSecondary }}
        style={{ borderRadius: 45, overflow: 'hidden' }}
        enablePanDownToClose
        onClose={() => setUserPanelVisible((cur) => !cur)}
        keyboardBlurBehavior={'restore'}
      >
        {children}
      </BottomSheet>
    </ModalBox>
  )
}
