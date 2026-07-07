import { Request, Response } from 'express'
import { prisma }            from '../lib/prisma'

// ── GET /api/assignments ──────────────────────────────────────
export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, termId } = req.query

    const assignments = await prisma.assignment.findMany({
      where: {
        ...(classId ? { classId: classId as string } : {}),
        ...(termId  ? { termId:  termId  as string } : {}),
        isPublished: true,
      },
      include: {
        subject:     true,
        createdBy:   { select: { firstName: true, lastName: true } },
        attachments: true,
        submissions: { select: { id: true, status: true, studentId: true } },
      },
      orderBy: { dueDate: 'asc' },
    })

    res.json({ assignments })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/assignments/teacher ──────────────────────────────
// All assignments created by this teacher (including drafts)
export const getTeacherAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user

    const assignments = await prisma.assignment.findMany({
      where:   { createdById: userId },
      include: {
        subject:     true,
        attachments: true,
        submissions: { select: { id: true, status: true, studentId: true } },
        class:       true,
      },
      orderBy: { assignedDate: 'desc' },
    })

    res.json({ assignments })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/assignments ─────────────────────────────────────
export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user
    const {
      title, description, classId, subjectId,
      termId, dueDate, maxScore, assignmentType,
    } = req.body

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        classId,
        subjectId,
        termId,
        createdById:    userId,
        dueDate:        new Date(dueDate),
        maxScore:       maxScore ? parseFloat(maxScore) : null,
        assignmentType: assignmentType || 'CLASSWORK',
        isPublished:    false,
      },
    })

    res.status(201).json({ message: 'Assignment created', assignment })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── PATCH /api/assignments/:id/publish ───────────────────────
export const togglePublish = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const current = await prisma.assignment.findUnique({ where: { id } })
    if (!current) { res.status(404).json({ error: 'Assignment not found' }); return }

    const updated = await prisma.assignment.update({
      where: { id },
      data:  { isPublished: !current.isPublished },
    })

    res.json({ message: `Assignment ${updated.isPublished ? 'published' : 'unpublished'}`, assignment: updated })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── PUT /api/assignments/:id ──────────────────────────────────
export const updateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }    = req.params
    const { title, description, dueDate, maxScore, assignmentType } = req.body

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        dueDate:        dueDate ? new Date(dueDate) : undefined,
        maxScore:       maxScore ? parseFloat(maxScore) : undefined,
        assignmentType: assignmentType || undefined,
      },
    })

    res.json({ message: 'Assignment updated', assignment: updated })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/assignments/:id/submissions ─────────────────────
export const getSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const submissions = await prisma.submission.findMany({
      where:   { assignmentId: id },
      include: {
        student: true,
        files:   true,
      },
      orderBy: { submittedAt: 'desc' },
    })

    res.json({ submissions })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/assignments/:id/submit ─────────────────────────
export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }        = req.params
    const { studentId, notes, files } = req.body

    const now = new Date()

    // Check if already submitted
    const existing = await prisma.submission.findFirst({
      where: { assignmentId: id, studentId },
    })

    const assignment = await prisma.assignment.findUnique({ where: { id } })
    const isLate     = assignment ? now > assignment.dueDate : false

    let submission
    if (existing) {
      submission = await prisma.submission.update({
        where: { id: existing.id },
        data: {
          status:      isLate ? 'LATE' : 'SUBMITTED',
          submittedAt: now,
          notes,
        },
      })
    } else {
      submission = await prisma.submission.create({
        data: {
          assignmentId: id,
          studentId,
          status:       isLate ? 'LATE' : 'SUBMITTED',
          submittedAt:  now,
          notes,
        },
      })
    }

    // Add file records if provided
    if (files && files.length > 0) {
      await prisma.submissionFile.createMany({
        data: files.map((f: any) => ({
          submissionId: submission.id,
          fileName:     f.fileName,
          fileUrl:      f.fileUrl,
          fileType:     f.fileType,
        })),
      })
    }

    res.status(201).json({ message: 'Assignment submitted', submission })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── PATCH /api/assignments/submissions/:id/grade ─────────────
export const gradeSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }              = req.params
    const { score, remarks }  = req.body

    const submission = await prisma.submission.update({
      where: { id },
      data:  { status: 'GRADED' },
    })

    res.json({ message: 'Submission graded', submission, score, remarks })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}