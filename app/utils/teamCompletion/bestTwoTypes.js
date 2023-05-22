module.exports = function bestTwoTypes(data) {
  const pairs = [];

  for (let i = 0; i < data.length; i += 1) {
    for (let j = i + 1; j < data.length; j += 1) {
      // console.log(data[i].matching_ids);
      const pair = {
        type_ids: [data[i].type_id, data[j].type_id],
        matching_ids: new Set(data[i].matching_ids.concat(data[j].matching_ids)),
      };

      pairs.push(pair);
    }
  }

  const sort = pairs.sort((a, b) => b.matching_ids.size - a.matching_ids.size);
  return sort;
};
