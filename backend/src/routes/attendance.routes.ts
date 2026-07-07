import { Router }           from 'express'
import { authenticate }     from '../middleware/authenticate'
import { authorize }        from '../middleware/authorize'
import {
  markAttendance,
  getSession,
  getClassAttendance,
  getStudentSummary,
} from '../controllers/attendance.controller'

const router = Router()

router.use(authenticate)

// Teacher marks attendance
router.post('/sessions',                        authorize('TEACHER', 'ADMIN'), markAttendance)

// Get session for a date
router.get('/sessions',                         authorize('TEACHER', 'ADMIN'), getSession)

// Monthly class report
router.get('/class/:classId',                   authorize('TEACHER', 'ADMIN'), getClassAttendance)

// Student summary for parent
router.get('/student/:studentId/summary',       authorize('ADMIN', 'TEACHER', 'PARENT'), getStudentSummary)

export default router