module.exports = {

  async getModifyingAbility(id) {
    let damage;
    switch (id) {
      case 11:
        damage = [
          {
            id: 11,
            name: 'Eau',
            damage: 0,
          },
        ];

        break;

      case 10:
        damage = [
          {
            id: 13,
            name: 'Electrik',
            damage: 0,
          },
        ];

        break;

      case 25:
        damage = [
          {
            id: 1,
            name: 'Normal',
            damage: 0,
          },
          {
            id: 2,
            name: 'Combat',
            damage: 0,
          },
          {
            id: 3,
            name: 'Vol',
            damage: 2,
          },
          {
            id: 4,
            name: 'Poison',
            damage: 0,
          },
          {
            id: 5,
            name: 'Sol',
            damage: 0,
          },
          {
            id: 6,
            name: 'Roche',
            damage: 2,
          },
          {
            id: 7,
            name: 'Insecte',
            damage: 0,
          },
          {
            id: 8,
            name: 'Spectre',
            damage: 2,
          },
          {
            id: 9,
            name: 'Acier',
            damage: 0,
          },
          {
            id: 10,
            name: 'Feu',
            damage: 2,
          },
          {
            id: 11,
            name: 'Eau',
            damage: 0,
          },
          {
            id: 12,
            name: 'Plante',
            damage: 0,
          },
          {
            id: 13,
            name: 'Electrik',
            damage: 0,
          },
          {
            id: 14,
            name: 'Psy',
            damage: 0,
          },
          {
            id: 15,
            name: 'Glace',
            damage: 0,
          },
          {
            id: 16,
            name: 'Dragon',
            damage: 0,
          },
          {
            id: 17,
            name: 'Ténèbre',
            damage: 2,
          },
          {
            id: 18,
            name: 'Fée',
            damage: 1,
          },
        ];

        break;

      case 26:
        damage = [
          {
            id: 12,
            name: 'Plante',
            damage: 0.5,
          },
        ];

        break;

      case 18:
        damage = [
          {
            id: 10,
            name: 'Feu',
            damage: 0,
          },
        ];

        break;

      case 31:
        damage = [
          {
            id: 13,
            name: 'Electrik',
            damage: 0,
          },
        ];
        break;

      case 47:
        damage = [{
          id: 10,
          name: 'Feu',
          damage: 0.5,
        },
        {
          id: 15,
          name: 'Glace',
          damage: 0.5,
        },
        ];
        break;

      case 78:
        damage = [
          {
            id: 13,
            name: 'Electrik',
            damage: 0,
          },
        ];
        break;

      case 114:
        damage = [
          {
            id: 11,
            name: 'Eau',
            damage: 0,
          },
        ];

        break;

      case 157:
        damage = [
          {
            id: 12,
            name: 'Plante',
            damage: 0,
          },
        ];
        break;

      case 199:
        damage = [
          {
            id: 10,
            name: 'Feu',
            damage: 0.5,
          },
        ];
        break;

      case 273:
        damage = [
          {
            id: 10,
            name: 'Feu',
            damage: 0,
          },
        ];

        break;

      case 297:
        damage = [
          {
            id: 5,
            name: 'Sol',
            damage: 0,
          },
        ];

        break;

      default:
        break;
    }
    console.log(damage);
    return damage;
  },

};
