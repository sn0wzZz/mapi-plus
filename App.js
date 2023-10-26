import React from 'react'

import { MapProvider } from './src/contexts/MapContext'
import { DarkModeProvider } from './src/contexts/DarkModeContext'
import { DbProvider } from './src/contexts/DbContext'

import MainNav from './src/ui/MainNav'

export default function App() {
  return (
    <DarkModeProvider>
      <MapProvider>
        <DbProvider>
          <MainNav />
        </DbProvider>
      </MapProvider>
    </DarkModeProvider>
  )
}
