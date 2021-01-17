export const selectAllergens = state => state.data.allergens
export const selectSelectedAllergenNames = state => {
  const { entities: allergens, selectedAllergens } = state.data.allergens
  if (!allergens.length || !selectedAllergens || !selectedAllergens.length) {
    return []
  }
  return selectedAllergens.map(i => {
    const allergen = allergens.find(a => a.allergen_id === i.allergen_id)
    return allergen ? allergen.name : ''
  })
}
