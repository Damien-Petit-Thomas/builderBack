//* this utils function create all possible pairs of types
//* and sort them by the number of matching ids

module.exports = function bestTwoTypes(data) {
  const pairs = [];
  console.log(data);
  for (let i = 0; i < data.length; i += 1) {
    for (let j = i; j < data.length; j += 1) {
      if (i === j) {
        const pair = {
          type_ids: [data[i].type_id],
          matching_ids: new Set(data[i].matching_ids),
        };
        pairs.push(pair);
      } else {
        const pair = {
          type_ids: [data[i].type_id, data[j].type_id],
          matching_ids: new Set(data[i].matching_ids.concat(data[j].matching_ids)),
        };

        pairs.push(pair);
      }
    }
  }

  const sort = pairs.sort((a, b) => b.matching_ids.size - a.matching_ids.size);

  return sort;
};
