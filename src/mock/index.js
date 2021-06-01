module.exports = function (request, response, next) {
  response.write(`hello world! \n\n- from \`${__filename}\``)
  response.end()
}
