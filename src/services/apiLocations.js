import supabase from './supabase'

export async function getLocations() {
  const { data, error } = await supabase.from('locations').select('*')

  if (error) {
    console.error(error)
    throw new Error('Locations could not be loaded')
  }

  return data
}
export async function deletLocation(id) {
  const { data ,error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Location could not be deleted')
  }

  return data
}
export async function createLocation(newLocation) {
const { data, error } = await supabase
  .from('locations')
  .insert([
    newLocation
  ])
  .select()

  if (error) {
    console.error(error)
    throw new Error('Location could not be created')
  }

  return data
}


