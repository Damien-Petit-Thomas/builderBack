module.exports = {
  getDamage(arr) {
    if (arr.length === 1) {
      return { ...arr[0] };
    }
    // console.log(arr);
    let totalDamage = {};
    totalDamage = Object.keys(arr[0]).reduce((acc, key) => {
      if (key in arr[1]) {
        acc[key] = arr[0][key] * arr[1][key];
      }
      return acc;
    }, {});
    return totalDamage;
  },
};
