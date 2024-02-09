import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser as updateUserApi } from '../../services/apiAuth'
import Toast from 'react-native-toast-message'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: ( user ) => {
      // Toast.show({
      //   type: 'success',
      //   text1: 'User up to date!',
      //   text2: 'Latest data avilable!',
      // })
      // console.log('newUser', user.user.user_metadata.links)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (err) =>
      Toast.show({
        type: 'error',
        text1: 'An error occured while updating your info!',
        text2: err.message,
      }),
  })

  return { isUpdating, updateUser }
}
