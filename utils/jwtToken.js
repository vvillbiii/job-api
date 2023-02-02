// save token in cookie
const sendToken = (user, statusCode, res) => {
  // create token
  const token = user.getJwtToken();

  //cookie options
  const options = {
    expire: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
  };

  //if production mode
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.statusCode(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = sendToken;
