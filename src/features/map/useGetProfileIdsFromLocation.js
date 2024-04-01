import { useQuery } from '@tanstack/react-query'
import {
  getProfileIdsFromLocation,
} from '../../services/apiAssociations'

export default function useGetProfileIdsFromLocation(id) {
  const { data, isFetching } = useQuery({
    queryKey: ['profiles', id],
    queryFn: () => getProfileIdsFromLocation(id),
  })

  return { data, isFetching }
}
