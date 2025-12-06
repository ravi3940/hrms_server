import  express  from  "express"
const router = express.Router();
import  { register , login , profile }   from  '../controllers/auth.controller.js';
import auth from "../middleware/auth.js";


router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);


export  default  router