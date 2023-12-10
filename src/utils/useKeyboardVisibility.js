import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

export default function useKeyboardVisibility() {
  const [isKeyboardVisible, setKeyboardVisibility] = useState(false)

  useEffect(() => {
    // Function to handle keyboard visibility changes
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide
    )

    // Clean up listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Event handler for when the keyboard is shown
  const handleKeyboardShow = (event) => {
    setKeyboardVisibility(true)
    // You can also access additional information about the keyboard event if needed
    // For example: event.endCoordinates.height
  }

  // Event handler for when the keyboard is hidden
  const handleKeyboardHide = () => {
    setKeyboardVisibility(false)
  }

  return isKeyboardVisible
}

