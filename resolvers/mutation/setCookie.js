const setCookie = ({ tokenName, token, res }) => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

module.exports = setCookie
