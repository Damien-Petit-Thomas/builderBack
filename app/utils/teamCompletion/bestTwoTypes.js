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
            matching_ids: data[i].matching_ids,
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

    pairs.sort((a, b) => b.matching_ids.length - a.matching_ids.length);

    return pairs;
  },

  best4types(data, isResist) {
    const pairs = [];
    const isUnique = [];

    for (let i = 0; i < data.length; i += 1) {
      for (let j = i; j < data.length; j += 1) {
        const sorted = [...new Set(data[i].type_ids.concat(data[j].type_ids).sort((a, b) => a - b))];
        const sortedString = JSON.stringify(sorted); // Convert sorted to a string

        if (!isUnique.includes(sortedString)) { // Check inclusion using sortedString
          const pair = {
            type_ids: sorted,
            matching_ids: [...new Set(data[i].matching_ids.concat(data[j].matching_ids, isResist))],
          };

          isUnique.push(sortedString); // Push sortedString instead of sorted
          pairs.push(pair);
        }
      }
    }

    const sortedPairs = pairs.sort((a, b) => b.matching_ids.length - a.matching_ids.length);

    const maxi = sortedPairs.filter((item) => item.matching_ids.length === 18);
    const best = sortedPairs.splice(0, 20);
    if (maxi.length > 0) {
      return maxi;
    }

    return best;
  },

  combinationsOf2(data) {
    const group = [];
    const combinations = new Set();
    for (let i = 0; i < data.length; i += 1) {
      const types = data[i].type_ids;
      if (types.length === 1) {
        const pair1 = [types[0]];
        group.push({ pair1 });
      }
      if (types.length === 2) {
        const pair1 = [types[0], types[1]];
        group.push({ pair1 });
      } else {
        for (let j = 0; j < types.length - 1; j += 1) {
          for (let k = j + 1; k < types.length; k += 1) {
            const pair1 = [types[j], types[k]];
            const remain = types.filter((id) => id !== types[j] && id !== types[k]);
            const pair2 = remain;
            pair1.sort();
            pair2.sort();
            const combination = [pair1, pair2].sort();
            const key = JSON.stringify(combination);

            if (!combinations.has(key)) {
              combinations.add(key);
              group.push({ pair1, pair2 });
            }
          }
        }
      }
    }
    console.log('group', group);
    return group;
  },
};
