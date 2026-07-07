import { Router }       from 'express'
import { authenticate } from '../middleware/authenticate'
import { authorize }    from '../middleware/authorize'
import {
  getAnnouncements,
  createAnnouncement,
  markRead,
  deleteAnnouncement,
} from '../controllers/announcements.controller'

const router = Router()

router.use(authenticate)

router.get ('/',          authorize('ADMIN','TEACHER','PARENT'), getAnnouncements)
router.post('/',          authorize('ADMIN','TEACHER'),          createAnnouncement)
router.patch('/:id/read', authorize('ADMIN','TEACHER','PARENT'), markRead)
router.delete('/:id',     authorize('ADMIN'),                    deleteAnnouncement)

export default router