import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    const { token } = req.headers
    if (!token || token === 'undefined' || token === 'null' || token === '') {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!token_decode || !token_decode.id) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        if (!req.body) req.body = {}
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log("Auth user token validation:", error.message)
        return res.json({ success: false, message: 'Session expired or invalid. Please login again.' })
    }
}

export default authUser
