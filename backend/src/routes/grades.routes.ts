import { Router }       from 'express'
import { authenticate } from '../middleware/authenticate'
import { authorize }    from '../middleware/authorize'
import {
  getClassGrades,
  createGrade,
  updateGrade,
  getStudentGrades,
  getSkillAssessments,
  saveSkillAssessment,
} from '../controllers/grades.controller'

const router = Router()

router.use(authenticate)

router.get ('/class/:classId',              authorize('TEACHER','ADMIN'),          getClassGrades)
router.post('/',                            authorize('TEACHER','ADMIN'),          createGrade)
router.put ('/:id',                         authorize('TEACHER','ADMIN'),          updateGrade)
router.get ('/student/:studentId',          authorize('ADMIN','TEACHER','PARENT'), getStudentGrades)
router.get ('/skill-assessments/:studentId',authorize('ADMIN','TEACHER','PARENT'), getSkillAssessments)
router.post('/skill-assessments',           authorize('TEACHER','ADMIN'),          saveSkillAssessment)

export default router