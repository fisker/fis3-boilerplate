function flatDeep(array) {
  return array.reduce(
    (acc, current) =>
      acc.concat(Array.isArray(current) ? flatDeep(current) : [current]),
    []
  )
}

module.exports = flatDeep
