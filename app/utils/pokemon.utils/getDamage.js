/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */

module.exports = {
  getDamage(arr1, arr2, arr3) {
    const types = ['normal', 'fighting', 'flying', 'ground', 'rock', 'bug', 'ghost', 'poison', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];

    const totalDamageFrom = {};
    types.map((type) => {
      const noDamage = arr1.filter((word) => word === type).length;
      const halfDamage = arr2.filter((word) => word === type).length;
      const doubleDamage = arr3.filter((word) => word === type).length;

      const noDamageFrom = (noDamage === 0 ? 1 : 0);
      const halfDomageFrom = (halfDamage === 0 ? 1 : halfDamage === 1 ? 0.5 : 0.25);
      const DoubleDomageFrom = (doubleDamage === 0 ? 1 : doubleDamage === 1 ? 2 : 4);

      totalDamageFrom[type] = noDamageFrom * halfDomageFrom * DoubleDomageFrom;
      return totalDamageFrom;
    });
    return totalDamageFrom;
  },
};
