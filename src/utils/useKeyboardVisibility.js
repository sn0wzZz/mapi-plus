import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

export default function useKeyboardVisibility() {
  const [isKeyboardVisible, setKeyboardVisibility] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const handleKeyboardShow = () => {
    setKeyboardVisibility(true)
  }
  
  const handleKeyboardHide = () => {
    setKeyboardVisibility(false)
  }

  return isKeyboardVisible
}

