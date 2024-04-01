import { useQuery } from '@tanstack/react-query'
import { getSpecificProfile } from '../../services/apiProfiles'

export function useGetProfile(id) {
  const {
    isFetching,
    data: profile,
    error,
  } = useQuery({
    queryKey: ['profiles', id],
    queryFn: () => getSpecificProfile(id),
    retry: false,
  })

  return { isFetching, error, profile }
}
