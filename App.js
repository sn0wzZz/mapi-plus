import { MapProvider } from './src/contexts/MapContext'
import { DarkModeProvider } from './src/contexts/DarkModeContext'
import { DbProvider } from './src/contexts/DbContext'

import TabNav from './src/features/navigation/TabNav'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './src/contexts/UserContext'

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
          <DbProvider>
            <TabNav />
          </DbProvider>
        </MapProvider>
        </UserProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  )
}
