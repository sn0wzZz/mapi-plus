import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout as logoutApi } from '../../services/apiAuth'

export function useLogout() {
  const queryClient = useQueryClient()
  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: (user) => {
      queryClient.removeQueries()
    },
  })

  return { logout, isPending }
}
