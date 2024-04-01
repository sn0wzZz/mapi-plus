import { View } from 'react-native'
import styled from 'styled-components/native'
import { useDarkMode } from '../contexts/DarkModeContext'
import theme from '../theme'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, useBottomSheet } from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useRef } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { deviceHeight } from '../utils/helpers'
import { Platform } from 'react-native'
import { useMapContext } from '../contexts/MapContext'

const ModalBox = styled(View)`
  position: absolute;
  padding: 10px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  border-radius: ${theme.radiuses.lg};
`

export default function Modal({ children }) {
  const { variant } = useDarkMode()
  const { setAccontPanelVisible, setShownProfile, setUserMatchesVisible } =
    useUserContext()
  const isKeyboardVisible = useKeyboardVisibility()
  const { setCalloutIsPressed } = useMapContext()

  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['50%'], [])

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  return (
    <ModalBox>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
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
        onClose={() => {
          setAccontPanelVisible(false)
          setCalloutIsPressed(false)
          setUserMatchesVisible(false)
          setShownProfile(null)
        }}
        keyboardBlurBehavior={'restore'}
      >

        {children}
      </BottomSheet>
    </ModalBox>
  )
}
