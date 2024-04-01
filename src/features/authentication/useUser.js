import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../services/apiAuth'

export default function useUser() {
  const { data: user, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: getCurrentUser,
  })

  return { user, isFetching, isAuthenticated: user?.role === 'authenticated' }
}
