/* eslint-disable max-len */
//* this util is used to get the damage multiplier for a pokemon type from all the other types *//
module.exports = {
  getDamage(arr) {
    if (arr.length === 1) {
      return arr[0];
    }
    // we destructure the array in two to get the damage from the first type and the second type
    const [totalDamage, totalDamage2] = arr;
    // we use reduce to get the damage multiplier for each type  the key is the type id and the value is the damage multiplier

    //   const result = Object.keys(totalDamage).reduce((acc, key) => {
    //     if (key in totalDamage2) {
    //       acc[key] = { ...totalDamage[key], damage: totalDamage[key].damage * totalDamage2[key].damage };
    //     } else {
    //       acc[key] = { ...totalDamage[key] };
    //     }

    //     return Object.values(acc);
    //   }, {});

    //   return result;
    // },
    const result = {};

    Object.keys(totalDamage).forEach((key) => {
      result[key] = { ...totalDamage[key], damage: totalDamage[key].damage * totalDamage2[key].damage };
    });

    return Object.values(result);
  },
};
