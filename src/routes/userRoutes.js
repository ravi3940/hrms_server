import  express  from  "express"
const router = express.Router();
import  {getProfile ,  listUsers , updateUser }  from  '../controllers/user.controller.js'
import   auth   from "../middleware/auth.js"


router.get('/me', auth, getProfile);
router.get('/', auth, listUsers);
router.put('/:id', auth, updateUser);


export  default  router;