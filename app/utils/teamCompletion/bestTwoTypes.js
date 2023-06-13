/* eslint-disable max-len */
//* this utils function create all possible pairs of types
//* and sort them by the number of matching ids

module.exports = {
  bestTwoTypes(data) {
    const pairs = [];

    for (let i = 0; i < data.length; i += 1) {
      for (let j = i; j < data.length; j += 1) {
        if (i === j) {
          const pair = {
            type_ids: [data[i].type_id],
            matching_ids: (data[i].matching_ids),
          };
          pairs.push(pair);
        } else {
          const pair = {
            type_ids: [data[i].type_id, data[j].type_id],
            matching_ids: [...new Set(data[i].matching_ids.concat(data[j].matching_ids))],
          };

          pairs.push(pair);
        }
      }
    }

    const sort = pairs.sort((a, b) => b.matching_ids.length - a.matching_ids.length);

    return sort;
  },

  best4types(data, isResist) {
    const pairs = [];
    const isUnique = [];

    for (let i = 0; i < data.length; i += 1) {
      for (let j = i; j < data.length; j += 1) {
        if (i === j && !isUnique.includes(data[i].type_ids.sort((a, b) => a - b))) {
          const pair = data[i];
          isUnique.push(pair.type_ids);
          pairs.push(pair);
        } else {
          const type = [...new Set(data[i].type_ids.concat(data[j].type_ids))];
          if (!isUnique.includes(type.sort((a, b) => a - b))) {
            const pair = {
              type_ids: type,
              matching_ids: [...new Set(data[i].matching_ids.concat(data[j].matching_ids, isResist))],
            };

            isUnique.push(pair.type_ids);
            pairs.push(pair);
          }
        }
      }
    }

    const sortedPairs = pairs.sort((a, b) => b.matching_ids.length - a.matching_ids.length);

    const maxi = sortedPairs.filter((item) => item.matching_ids.length === 18);

    if (maxi.length > 0) {
      const group = [];
      const combinations = new Set();
      for (let i = 0; i < maxi.length; i += 1) {
        const types = maxi[i].type_ids;
        for (let j = 0; j < types.length - 1; j += 1) {
          for (let k = j + 1; k < types.length; k += 1) {
            const group1 = [types[j], types[k]];
            const remain = types.filter((item) => item !== types[j] && item !== types[k]);
            for (let l = 0; l < remain.length - 1; l += 1) {
              for (let m = l + 1; m < remain.length; m += 1) {
                const group2 = [remain[l], remain[m]];

                group1.sort();
                group2.sort();
                const combination = [group1, group2];
                combination.sort();
                const key = JSON.stringify(combination);

                if (!combinations.has(key)) {
                  combinations.add(key);
                  group.push({ group1, group2 });
                }
              }
            }
          }
        }
      }

      return group;
    }
    return null;
  },

};
