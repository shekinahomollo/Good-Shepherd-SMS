import { Router }       from 'express'
import { authenticate } from '../middleware/authenticate'
import { authorize }    from '../middleware/authorize'
import {
  getAllClasses, getClass, getClassRoster,
  createClass, updateClass,
} from '../controllers/classes.controller'

const router = Router()
router.use(authenticate)

router.get ('/',                       authorize('ADMIN','TEACHER'), getAllClasses)
router.get ('/:id',                    authorize('ADMIN','TEACHER'), getClass)
router.get ('/:classId/students',      authorize('ADMIN','TEACHER'), getClassRoster)
router.post('/',                       authorize('ADMIN'),           createClass)
router.put ('/:id',                    authorize('ADMIN'),           updateClass)

export default router