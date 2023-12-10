import { useState } from 'react'

export default function useGeoCoding() {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const getInfo = async (coordinates) => {
    if (!coordinates) return
    const { latitude, longitude } = coordinates

    const raw = JSON.stringify({
      latitude,
      longitude,
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    }

    try {
      const response = await fetch(
        'https://mapi-server.netlify.app/.netlify/functions/getStreetInfo',
        // 'http://192.168.1.2:3000/.netlify/functions/getStreetInfo',
        requestOptions
      )
      const result = await response.json()
      return result.streetInfo
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getCoords = async (address) => {
    if (!address) return
    console.log('----------address',address)

    const raw = JSON.stringify({
      address: address,
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    }

    try {
      const response = await fetch(
        'https://mapi-server.netlify.app/.netlify/functions/getStreetCoords',
        // 'http://192.168.1.2:3000/.netlify/functions/getStreetCoords',
        requestOptions
      )
      const result = await response.json()
      console.log('Fetched results:', result)
      return result.searchResult
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getSuggestions = async (queryStr) => {
    if (!queryStr) return

    console.log('QueryString:', queryStr)

    const raw = JSON.stringify({
      queryStr: queryStr,
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    }

    try {
      const response = await fetch(
        // 'https://mapi-server.netlify.app/.netlify/functions/getSuggestions',
        'http://192.168.1.2:3000/.netlify/functions/getSuggestions',
        requestOptions
      )
      const result = await response.json()
      console.log('Fetched results:', result.searchResult)
      return result.searchResult
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getDirections = async (origin, destination) => {
    if (!origin || !destination) return
    const { latitude: latSt, longitude: lngSt } = origin
    const { latitude: latFn, longitude: lngFn } = destination

    const raw = JSON.stringify({
      origin: {
        latitude: latSt,
        longitude: lngSt,
      },
      destination: {
        latitude: latFn,
        longitude: lngFn,
      },
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    }

    try {
      const response = await fetch(
        'https://mapi-server.netlify.app/.netlify/functions/getDirections',
        // 'http://192.168.1.2:3000/.netlify/functions/getDirections',
        requestOptions
      )
      const result = await response.json()
      console.log('Fetched directions: ', result)
      return result
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const ARCGIS_ENDPOINT =
    'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'

  const getAutocompleteResults = async (searchText) => {
    if(!searchText) return
    try {
      const queryParams = new URLSearchParams({
        text: searchText,
        f: 'json', // Specify JSON response
        apiKey: 'YOUR_ARCGIS_API_KEY', // Replace with your ArcGIS API key
      })

      const response = await fetch(`${ARCGIS_ENDPOINT}?${queryParams}`)
      const data = await response.json()
      console.log('------search data---------',data)

      // Extract suggestions from the response

          const suggestions = data.suggestions?.map((suggestion) => ({
            id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
            name: suggestion.text,
            magicKey: suggestion.magicKey,
            location: suggestion.isCollection
              ? null
              : {
                  latitude:
                    suggestion.location,
                  longitude:
                    suggestion.location
                },
          }))
          console.log(data.suggestions[0])
      return suggestions
    } catch (error) {
      console.error('Error fetching autocomplete results:', error)
      return []
    }
  }

  return {
    getInfo,
    getCoords,
    getDirections,
    getSuggestions,
    getAutocompleteResults,
  }
}
