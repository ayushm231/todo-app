const UserAuth = (req, res, next) => {
  const userId = req.header("X-User-ID")
  if (!userId)
    return res.status(401).json({ message: "User ID missing in headers" })

  req.userId = userId
  next()
}

export default UserAuth
