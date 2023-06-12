//* This file is used to calculate the number of resistances, weaknesses, and immunities of a team.
// In the first version of the completion algorithm, we only use getNumberOfResistanceByType.
// getNumberOfWeaknessByType provides the number of resistances for each type of the team.
// completion algorithm is based on finding a Pokémon that brings a resistance where it is lacking.

function getTotalDamages(pokemons) {
  return pokemons.flatMap((pokemon) => pokemon.damageFromRelations);
}

function getNumberOfResistanceByType(pokemons) {
  const totalDamages = getTotalDamages(pokemons);

  return totalDamages.reduce((acc, damage) => {
    if (damage.damage < 1) {
      acc[damage.id] = (acc[damage.id] || 0) + 1;
    } else {
      acc[damage.id] = acc[damage.id] || 0;
    }

    return acc;
  }, {});
}

function getNumberOfWeaknessByType(pokemons) {
  const totalDamages = getTotalDamages(pokemons);

  return totalDamages.reduce((acc, damage) => {
    if (damage.damage > 1) {
      acc[damage.id] = (acc[damage.id] || 0) + 1;
    } else {
      acc[damage.id] = acc[damage.id] || 0;
    }

    return acc;
  }, {});
}

function getNumberOfImmunityByType(pokemons) {
  const totalDamages = getTotalDamages(pokemons);

  return totalDamages.reduce((acc, damage) => {
    if (damage.damage === 0) {
      acc[damage.id] = (acc[damage.id] || 0) + 1;
    } else {
      acc[damage.id] = acc[damage.id] || 0;
    }
    return acc;
  }, {});
}

function totalResistance(pokemons) {
  const totalDamages = getTotalDamages(pokemons);

  return totalDamages.reduce((acc, damage) => {
    if (damage.damage > 1) {
      acc[damage.id] = (acc[damage.id] || 0) - 1;
    } else if (damage.damage < 1) {
      acc[damage.id] = (acc[damage.id] || 0) + 1;
    } else {
      acc[damage.id] = acc[damage.id] || 0;
    }

    return acc;
  }, {});
}

module.exports = {
  getTotalDamages,
  getNumberOfResistanceByType,
  getNumberOfWeaknessByType,
  getNumberOfImmunityByType,
  totalResistance,
};
