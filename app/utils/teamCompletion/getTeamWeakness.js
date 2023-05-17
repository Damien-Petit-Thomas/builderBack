module.exports = (pokemons) => {
  const totalDamages = pokemons.map((pokemon) => pokemon.damageFromRelations);

  const result = totalDamages.reduce(
    (acc, damage) => {
      damage.forEach((type) => {
        if (type.id in acc) {
          acc[type.id].damage *= type.damage;
        } else {
          acc[type.id] = { ...type };
        }
      });

      return acc;
    },
    {},
  );

  return Object.values(result);
};
