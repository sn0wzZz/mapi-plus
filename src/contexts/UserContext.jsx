import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

function UserProvider({ children }) {
  const [AccontPanelVisible, setAccontPanelVisible] = useState(false)
  const [shownProfile, setShownProfile] = useState(null)
  const [profileList, setProfileList] = useState(null)
  const [filterValue, setFilterValue] = useState('*')
  const [sorted, setSorted] = useState(true)
  const [personalSort, setPesonalSort] = useState(true)
  const [userMatchesVisible, setUserMatchesVisible] = useState(false)
  const [userMatchesList, setUserMatchesList] = useState([])
  const [allMatchesList, setAllMatchesList] = useState([])
  const [currentRoute, setCurrentRoute] = useState(null)

  return (
    <UserContext.Provider
      value={{
        AccontPanelVisible,
        setAccontPanelVisible,
        shownProfile,
        setShownProfile,
        profileList,
        setProfileList,
        filterValue,
        setFilterValue,
        sorted,
        setSorted,
        userMatchesVisible,
        setUserMatchesVisible,
        userMatchesList,
        setUserMatchesList,
        allMatchesList,
        setAllMatchesList,
        personalSort,
        setPesonalSort,
        currentRoute,
        setCurrentRoute,
      }}
    >
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
