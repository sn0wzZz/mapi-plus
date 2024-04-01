import supabase from './supabase'

export async function createMatch(newMatch) {
  const { data, error } = await supabase.from('matches').upsert([newMatch])

  if (error) {
    throw new Error('Match could not be created')
  }

  return data
}

export async function getUserMatches({ id, status }) {
  const { data, error } = await supabase
    .from('matches')
    .select('user_id, profile_id')
    .or(`user_id.eq.${id},profile_id.eq.${id}`)
    .eq('status', status)

  // console.log(data)

  if (error) {
    throw new Error(error.message)
  }

  const filteredData =
    status === 'matched'
      ? data.map((match) =>
          match.user_id === id ? match.profile_id : match.user_id
        )
      : data.map((match) => ({
          initializer: match.user_id,
          confirmer: match.profile_id,
        }))

  return filteredData
}

export async function getAllMatches() {
  const { data, error } = await supabase.from('matches').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateMatch(id, obj) {
  const { data, error } = await supabase
    .from('matches')
    .update({ ...obj })
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Match could not be updated')
  }
  return data
}

export async function deleteMatch(id) {
  const { data, error } = await supabase.from('matches').delete().eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Match could not be deleted')
  }
  return data
}
