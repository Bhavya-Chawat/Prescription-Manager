function ok(data, message = 'OK') {
  return { success: true, message, data };
}

module.exports = { ok };