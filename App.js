import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MapProvider } from './src/contexts/MapContext'
import { DarkModeProvider } from './src/contexts/DarkModeContext'
import { DbProvider } from './src/contexts/DbContext'

import Navbar from './src/features/navigation/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './src/contexts/UserContext'
import { ListContextProvider } from './src/contexts/ListContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <UserProvider>
          <MapProvider>
            <ListContextProvider>
              <DbProvider>
                <GestureHandlerRootView>
                  <Navbar />
                </GestureHandlerRootView>
              </DbProvider>
            </ListContextProvider>
          </MapProvider>
        </UserProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  )
}
