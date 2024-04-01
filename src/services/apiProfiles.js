import supabase from './supabase'

export async function getAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*')

  if (error) throw new Error(error.message)
  return data
}
export async function getSpecificProfile(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getProfilesByIds(ids) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', ids)

  if (error) {
    throw new Error(error.message)
  }

  return data
}