import { Router }       from 'express'
import { authenticate } from '../middleware/authenticate'
import { authorize }    from '../middleware/authorize'
import {
  getAllStudents, getStudent, createStudent,
  updateStudent, toggleStudentActive,
} from '../controllers/students.controller'

const router = Router()
router.use(authenticate)

router.get ('/',              authorize('ADMIN','TEACHER'),          getAllStudents)
router.get ('/:id',           authorize('ADMIN','TEACHER'),          getStudent)
router.post('/',              authorize('ADMIN'),                    createStudent)
router.put ('/:id',           authorize('ADMIN'),                    updateStudent)
router.patch('/:id/toggle',  authorize('ADMIN'),                    toggleStudentActive)

export default router