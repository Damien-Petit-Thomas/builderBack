/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
//* this utils aims to get the damage multiplier from a pokemon type to another  *//
module.exports = {
  getDamage(arr1, arr2, arr3) {
    // todo dynamic types
    const types = [
      { id: 1, name: 'Normal' },
      { id: 2, name: 'Combat' },
      { id: 3, name: 'Vol' },
      { id: 4, name: 'Poison' },
      { id: 5, name: 'Sol' },
      { id: 6, name: 'Roche' },
      { id: 7, name: 'Insecte' },
      { id: 8, name: 'Spectre' },
      { id: 9, name: 'Acier' },
      { id: 10, name: 'Feu' },
      { id: 11, name: 'Eau' },
      { id: 12, name: 'Plante' },
      { id: 13, name: 'Electrik' },
      { id: 14, name: 'Psy' },
      { id: 15, name: 'Glace' },
      { id: 16, name: 'Dragon' },
      { id: 17, name: 'Ténèbre' },
      { id: 18, name: 'Fée' },
    ];

    const totalDamageFrom = [];
    types.forEach((type) => {
      // we count the number of time the type is in the array
      const noDamage = arr1.filter((word) => Number(word) === type.id).length;
      const halfDamage = arr2.filter((word) => Number(word) === type.id).length;
      const doubleDamage = arr3.filter((word) => Number(word) === type.id).length;

      const noDamageFrom = (noDamage === 0 ? 1 : 0);
      const halfDomageFrom = (halfDamage === 0 ? 1 : halfDamage === 1 ? 0.5 : 0.25);
      const DoubleDomageFrom = (doubleDamage === 0 ? 1 : doubleDamage === 1 ? 2 : 4);

      const damage = noDamageFrom * halfDomageFrom * DoubleDomageFrom;
      totalDamageFrom.push({ ...type, damage });
    });

    return totalDamageFrom;
  },
};
