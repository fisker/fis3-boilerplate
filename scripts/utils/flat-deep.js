function flatDeep(arr) {
  return arr.reduce(
    (acc, current) =>
      acc.concat(Array.isArray(current) ? flatDeep(current) : [current]),
    []
  )
}

module.exports = flatDeep
