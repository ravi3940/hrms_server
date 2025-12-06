import jwt from "jsonwebtoken"


const auth = (req, res, next) => {

    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ message: 'No token' });
    else {
        const token = auth.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded; next();
        }
        catch (e) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}
export default auth