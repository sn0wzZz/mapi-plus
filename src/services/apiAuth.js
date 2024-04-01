import supabase from './supabase'
import { SUPABASE_URL } from '@env'

export async function signup({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        avatar: '',
        links: '',
      },
    },
  })

  if (error) {
    throw new Error(error)
  }

  return data
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return null

  const { data, error } = await supabase.auth.getUser()

  if (error) throw new Error(error.message)

  return data?.user
}

export async function updateUser({ name, password, links, avatar }) {
  let updatedData
  if (password) updatedData = { password }
  if (name) updatedData = { data: { name } }
  if (links) updatedData = { data: { links } }

  const { data, error } = await supabase.auth.updateUser(updatedData)

  if (error) throw new Error(error.message)
  if (!avatar) return data

  const fileName = `avartar-${data.user.id}-${Math.random()}.png`

  const { error: storageError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar, { contentType: 'image/png' })

  if (storageError) throw new Error(storageError.message)

  const { data: updatedUser, error: error2 } = supabase.auth.updateUser({
    data: {
      avatar: `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`,
    },
  })

  if (error2) throw new Error(error2.message)
  return updatedUser
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}
