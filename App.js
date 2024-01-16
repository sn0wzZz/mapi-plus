import { MapProvider } from './src/contexts/MapContext'
import { DarkModeProvider } from './src/contexts/DarkModeContext'
import { DbProvider } from './src/contexts/DbContext'

import TabNav from './src/features/navigation/TabNav'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
        <MapProvider>
          <DbProvider>
            <TabNav />
          </DbProvider>
        </MapProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  )
}
