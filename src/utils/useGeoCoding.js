import uuid from 'react-native-uuid'

export default function useGeoCoding() {
  // eslint-disable-next-line no-undef
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
        requestOptions
      )
      const result = await response.json()
      // console.log('Fetched results:', result)
      return result.searchResult
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getSuggestions = async (queryStr) => {
    if (!queryStr) return

    // console.log('QueryString:', queryStr)

    // eslint-disable-next-line no-undef
    const myHeaders = new Headers()
    myHeaders.append(
      'X-RapidAPI-Key',
      '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac'
    )
    myHeaders.append('X-RapidAPI-Host', 'place-autocomplete1.p.rapidapi.com')

    const raw = ''

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'manual',
    }

    try {
      const response = await fetch(
        `https://place-autocomplete1.p.rapidapi.com/autocomplete/json?input=${encodeURIComponent(
          queryStr
        )}&radius=500`,
        requestOptions
      )
      const result = await response.json()

      const res = result?.predictions.map((prediction) => {
        return {
          id: uuid.v4(),
          name: prediction.description,
        }
      })
      // console.log('Fetched results:', res)

      return res
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
        requestOptions
      )
      const result = await response.json()
      // console.log('Fetched directions: ', result)
      return result
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return {
    getInfo,
    getCoords,
    getDirections,
    getSuggestions,
  }
}
