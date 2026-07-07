import { Router }       from 'express'
import { authenticate } from '../middleware/authenticate'
import { authorize }    from '../middleware/authorize'
import {
  getAssignments,
  getTeacherAssignments,
  createAssignment,
  togglePublish,
  updateAssignment,
  getSubmissions,
  submitAssignment,
  gradeSubmission,
} from '../controllers/assignments.controller'

const router = Router()

router.use(authenticate)

router.get ('/',                          authorize('ADMIN','TEACHER','PARENT'), getAssignments)
router.get ('/teacher',                   authorize('TEACHER','ADMIN'),          getTeacherAssignments)
router.post('/',                          authorize('TEACHER','ADMIN'),          createAssignment)
router.put ('/:id',                       authorize('TEACHER','ADMIN'),          updateAssignment)
router.patch('/:id/publish',             authorize('TEACHER','ADMIN'),          togglePublish)
router.get ('/:id/submissions',           authorize('TEACHER','ADMIN'),          getSubmissions)
router.post('/:id/submit',               authorize('PARENT'),                   submitAssignment)
router.patch('/submissions/:id/grade',   authorize('TEACHER','ADMIN'),          gradeSubmission)

export default router