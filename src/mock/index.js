module.exports = function(req, res, next) {
  res.write(`hello world! \n\n- from \`${__filename}\``)
  res.end()
}
