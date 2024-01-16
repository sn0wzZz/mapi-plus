import { ActivityIndicator, Keyboard } from 'react-native'
import { useForm } from 'react-hook-form'

import Input from '../../ui/Input'
import ButtonText from '../../ui/ButtonText'
import DismissKeyboard from '../../ui/DismissKeyboard'
import useLogin from './useLogin'
import theme from '../../theme'

export default function LoginForm() {
  const {login, isPending} = useLogin()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'hello@email.com',
      password: '123456789',
    },
  })
    const onSubmit = (data) => {
      // if(!email||!password) return
      Keyboard.dismiss()
      login(data)
    }



  return (
    <DismissKeyboard>
      <InputContainer>
        <Input
          type='email'
          control={control}
          name='email'
          iconName='mail-outline'
          placeholder='Email'
          error={errors.email}
          rules={{
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          }}
        />

        <Input
          type='password'
          control={control}
          name='password'
          iconName='lock-closed-outline'
          placeholder='Password'
          error={errors.password}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 3,
              message: 'Password must be at least 3 characters',
            },
          }}
        />

        <ButtonText
          variant='primary'
          title='Submit'
          onPressFunction={handleSubmit(onSubmit)}
        >
          {!isPending ? (
            'Login'
          ) : (
            <ActivityIndicator
              animating={true}
              color={theme.colors.backgroundTrSolid}
              size={29}
            />
          )}
        </ButtonText>
        {/* <ButtonText title="Submit">Sign up with Google </ButtonText> */}
      </InputContainer>
    </DismissKeyboard>
  )
}
