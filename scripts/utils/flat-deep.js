function flatDeep(array) {
  return array.reduce(
    (accumulator, current) => [
      ...accumulator,
      ...(Array.isArray(current) ? flatDeep(current) : [current]),
    ],
    []
  )
}

module.exports = flatDeep
