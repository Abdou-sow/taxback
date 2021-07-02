const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const result = jwt.verify(token, config.secret)

        

        // if (result.id) {
        //     const user = await userModel.findById({ _id: result.id })

        //     next()
        // }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

exports.module = verifyToken;