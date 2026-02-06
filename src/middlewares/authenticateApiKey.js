module.exports = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== "secret_key") {
    return res.status(401).json({
      message: "Unauthorized: invalid or missing API key"
    });
  }

  next();
};
