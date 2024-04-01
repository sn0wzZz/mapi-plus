import { useQuery } from '@tanstack/react-query'
import { getAllMatches } from '../../services/apiMatches'

export default function useGetAllMatches() {
  const {
    error,
    data: allMatches,
    isFetching,
  } = useQuery({
    queryKey: ['matches'],
    queryFn: getAllMatches,
  })

  return { allMatches, isFetching, error }
}
