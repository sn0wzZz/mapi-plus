import { useMutation } from '@tanstack/react-query'
import { login as loginApi } from '../../services/apiAuth'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'


export default function useLogin() {
  const navigation = useNavigation()

  const {mutate: login, isPending} =useMutation({
    mutationFn: ({email, password})=> loginApi({email, password}),
    onSuccess: (user)=>{
      // console.log(user)
      // navigation.navigate('MainRoutes')
    },
    onError: err=>{
    console.log('💥',err.message)
    Toast.show({
      type: 'error',
      text1:'Provided credentials are incorrect!',
      text2: 'Email or password are incorrect.'
    })
    }
  })


  return {login, isPending}
}