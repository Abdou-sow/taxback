
const verifyToken = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]

        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }

        const result = jwt.verify(token, config.secret)

        if (result.id) {
            const user = await userModel.findById(result.id).lean()

            req.user = user.id
            next()
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(401).json({ message: "You don't have acces to this information" })
    }
}

module.exports = { verifyToken }