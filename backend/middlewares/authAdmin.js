import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken || atoken === 'undefined' || atoken === 'null' || atoken === '') {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        
        const isValidAdmin = 
            token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ||
            token_decode?.role === 'admin' ||
            (token_decode?.email && (token_decode.email === process.env.ADMIN_EMAIL || token_decode.email === 'admin@caresync.com' || token_decode.email === 'admin@healthverse.com'))

        if (!isValidAdmin) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        next()
    } catch (error) {
        console.log("Auth admin token validation:", error.message)
        res.json({ success: false, message: 'Admin session expired or invalid. Please login again.' })
    }
}

export default authAdmin;