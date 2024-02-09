import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

function UserProvider({ children }) {
  const [userPanelVisible, setUserPanelVisible] = useState(false)

  return (
    <UserContext.Provider value={{ userPanelVisible, setUserPanelVisible }}>
      {children}
    </UserContext.Provider>
  )
}
function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined)
    throw new Error('UserContext was used outside of UserProvider')
  return context
}
export { UserProvider, useUserContext }
