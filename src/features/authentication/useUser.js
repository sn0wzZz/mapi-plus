import { useQueries, useQuery } from '@tanstack/react-query'
import { getCourrentUser } from '../../services/apiAuth'

export default function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getCourrentUser,
  })

  return { user, isLoading, isAuthenticated: user?.role === 'authenticated' }
}
