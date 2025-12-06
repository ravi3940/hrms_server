import express   from  "express"
const router = express.Router();
import {startOnboarding , getOnboarding,  updateTask , uploadDocument}    from "../controllers/onboarding.controller.js"
import  auth  from  "../middleware/auth.js"
import   upload   from  "../middleware/upload.js"


router.post('/start', auth, startOnboarding);
router.get('/:id', auth, getOnboarding);
router.put('/:id/task', auth, updateTask);
router.post('/:id/doc', auth, upload.single('doc'), uploadDocument);


export  default  router;