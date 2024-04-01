import { useQuery } from '@tanstack/react-query'
import { getUserMatches as getUserMatchesApi } from '../../services/apiMatches'

export default function useUserMatches(id, status) {
  const {
    error,
    data: userMatches,
    isPending,
  } = useQuery({
    queryKey: ['matches', id, status],
    queryFn: () => getUserMatchesApi({id, status}),
  })

  return { userMatches, isPending, error }
}
