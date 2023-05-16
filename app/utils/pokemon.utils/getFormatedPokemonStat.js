/* eslint-disable max-len */
module.exports = {

  getFormatedStat(arr) {
    const hp = arr[0].base_stat;
    const attack = arr[1].base_stat;
    const defense = arr[2].base_stat;
    const specialAttack = arr[3].base_stat;
    const specialDefense = arr[4].base_stat;
    const speed = arr[5].base_stat;
    return {
      hp, attack, defense, specialAttack, specialDefense, speed,
    };
  },
};
