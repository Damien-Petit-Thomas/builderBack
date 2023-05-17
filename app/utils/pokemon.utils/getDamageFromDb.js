/* eslint-disable max-len */
module.exports = {
  getDamage(arr) {
    if (arr.length === 1) {
      return arr[0];
    }

    const [totalDamage, totalDamage2] = arr;

    const result = Object.keys(totalDamage).reduce((acc, key) => {
      if (key in totalDamage2) {
        acc[key] = { ...totalDamage[key], damage: totalDamage[key].damage * totalDamage2[key].damage };
      } else {
        acc[key] = { ...totalDamage[key] };
      }

      return Object.values(acc);
    }, {});

    return result;
  },
};
