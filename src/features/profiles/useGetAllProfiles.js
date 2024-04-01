import { useQuery } from '@tanstack/react-query'
import { getAllProfiles as getAllProfilesApi } from '../../services/apiProfiles'

export default function useGetAllProfiles() {
  const { data, isFetching } = useQuery({
    queryKey: ['profiles'],
    queryFn: getAllProfilesApi,
  })
  return { data, isFetching }
}
