import { useQuery } from '@tanstack/react-query'
import { getProfilesByIds } from '../../services/apiProfiles'

export default function useGetProfileByIds(ids) {
  const { data, isPending } = useQuery({
    queryKey: ['profiles', ids],
    queryFn: () => getProfilesByIds(ids),
  })

  return { data, isPending }
}
