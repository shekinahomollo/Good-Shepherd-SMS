import { Request, Response } from 'express'
import { prisma }            from '../lib/prisma'

// ── GET /api/grades/class/:classId ────────────────────────────
export const getClassGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId }  = req.params
    const { termId }   = req.query

    const grades = await prisma.grade.findMany({
      where: {
        classId,
        ...(termId ? { termId: termId as string } : {}),
      },
      include: {
        student:    true,
        subject:    true,
        recordedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: [{ student: { lastName: 'asc' } }, { subject: { name: 'asc' } }],
    })

    res.json({ grades })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/grades ──────────────────────────────────────────
export const createGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId }   = (req as any).user
    const {
      studentId, subjectId, classId, termId,
      gradeType, rawScore, maxScore, remarks, assignmentId,
    } = req.body

    const percentage = Math.round((rawScore / maxScore) * 100)
    const gradeLabel = getGradeLabel(percentage)

    const grade = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        classId,
        termId,
        gradeType,
        rawScore:    parseFloat(rawScore),
        maxScore:    parseFloat(maxScore),
        percentage,
        gradeLabel,
        remarks,
        recordedById: userId,
        ...(assignmentId ? { assignmentId } : {}),
      },
    })

    res.status(201).json({ message: 'Grade recorded', grade })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── PUT /api/grades/:id ───────────────────────────────────────
export const updateGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }                         = req.params
    const { rawScore, maxScore, remarks } = req.body

    const percentage = Math.round((rawScore / maxScore) * 100)
    const gradeLabel = getGradeLabel(percentage)

    const grade = await prisma.grade.update({
      where: { id },
      data:  { rawScore, maxScore, percentage, gradeLabel, remarks },
    })

    res.json({ message: 'Grade updated', grade })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/grades/student/:studentId ───────────────────────
export const getStudentGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params
    const { termId }    = req.query

    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        ...(termId ? { termId: termId as string } : {}),
      },
      include: { subject: true, term: true },
      orderBy: { subject: { name: 'asc' } },
    })

    res.json({ grades })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/grades/skill-assessments/:studentId ─────────────
export const getSkillAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params
    const { termId }    = req.query

    const assessments = await prisma.skillAssessment.findMany({
      where: {
        studentId,
        ...(termId ? { termId: termId as string } : {}),
      },
      include: {
        skillDescriptor: true,
      },
    })

    res.json({ assessments })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/grades/skill-assessments ───────────────────────
export const saveSkillAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId }                                        = (req as any).user
    const { studentId, skillDescriptorId, termId, rating, remarks } = req.body

    const assessment = await prisma.skillAssessment.upsert({
      where: {
        // Use a composite unique if you add one, otherwise findFirst + upsert
        id: (await prisma.skillAssessment.findFirst({
          where: { studentId, skillDescriptorId, termId },
        }))?.id || '',
      },
      update:  { rating, remarks },
      create:  { studentId, skillDescriptorId, termId, rating, remarks, recordedById: userId },
    })

    res.json({ message: 'Skill assessment saved', assessment })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── Helper — grade label from percentage ─────────────────────
function getGradeLabel(pct: number): string {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 75) return 'B+'
  if (pct >= 70) return 'B'
  if (pct >= 65) return 'C+'
  if (pct >= 60) return 'C'
  if (pct >= 55) return 'D+'
  if (pct >= 50) return 'D'
  return 'E'
}