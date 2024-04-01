import { createContext, useContext, useState } from 'react'
import theme from '../theme'

const DarkModeContext = createContext()

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const variant = isDarkMode ? theme.colors : theme.colorsLight

  const toggleDarkMode = () => {
    setIsDarkMode((isDark) => !isDark)
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, variant }}>
      {children}
    </DarkModeContext.Provider>
  )
}
function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined)
    throw new Error('DarkModeContext was used outside of ListProvider')
  return context
}
export { DarkModeProvider, useDarkMode }
