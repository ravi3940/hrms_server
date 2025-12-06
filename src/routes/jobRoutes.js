import    express  from  "express"
const router = express.Router();
import  {createJob , getJobs,getJobById,  updateJob,  deleteJob }   from  '../controllers/job.controller.js';
import  auth  from    "../middleware/auth.js"


router.post('/', auth, createJob);
router.get('/', auth,  getJobs);
router.get('/:id', auth, getJobById);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);


export  default router;