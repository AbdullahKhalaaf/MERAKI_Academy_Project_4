const authorization = (endpointPermission) => {
  return (req, res, next) => {
    const token = req.token;
    console.log(token);

    const isExist = token.role.permissions.includes(endpointPermission);
    if (isExist) {
      next();
    } else {
      res.status(403).json({
        success: false,
        massage: "Unauthorized",
      });
    }
  };
};

module.exports = authorization;
