import { Keyboard } from 'react-native'
import { useForm } from 'react-hook-form'

import Input from '../../ui/Input'

import ButtonText from '../../ui/ButtonText'
import DismissKeyboard from '../../ui/DismissKeyboard'
import InputContainer from '../../ui/InputContainer'

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  })
  const onSubmit = (data) => {
    Keyboard.dismiss()
    console.log(data)
  }

  return (
    <DismissKeyboard>
      <InputContainer>
        <Input
          type='name'
          control={control}
          name='ename'
          iconName='person-outline'
          placeholder='Name'
          rules={{
            required: 'Name is required',
          }}
        />

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
          placeholder='Passowrd'
          error={errors.password}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 3,
              message: 'Password must be at least 3 characters',
            },
          }}
        />

        <Input
          type='password'
          control={control}
          name='repeatPassword'
          iconName='repeat-outline'
          placeholder='Repeat password'
          error={errors.repeatPassword}
          rules={{
            required: 'This field is required',
            validate: (value) =>
              value === getValues().password || 'Passwords need to match',
          }}
        />

        <ButtonText
          variant='primary'
          title='Submit'
          onPressFunction={handleSubmit(onSubmit)}
        >
          Sign Up
        </ButtonText>
        {/* <ButtonText title="Submit">Sign up with Google </ButtonText> */}
      </InputContainer>
    </DismissKeyboard>
  )
}
