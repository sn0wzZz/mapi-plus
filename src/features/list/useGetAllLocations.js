import { useQuery } from '@tanstack/react-query'
import { getLocations } from '../../services/apiLocations'
import { useIsFocused } from '@react-navigation/native'

export default function useGetAllLocations() {
  const {
    error,
    data: onlineData,
    isLoading,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    // enabled: useIsFocused,
  })

  return { onlineData, isLoading }
}
