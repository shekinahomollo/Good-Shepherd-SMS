import { Request, Response } from 'express'
import { prisma }            from '../lib/prisma'

export const getAllClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = (req as any).user

    const classes = await prisma.class.findMany({
      where: role === 'TEACHER' ? { classTeacherId: userId } : {},
      include: {
        gradeLevel:   true,
        classTeacher: { select: { firstName: true, lastName: true } },
        academicYear: true,
        enrollments:  { select: { id: true } },
      },
      orderBy: { gradeLevel: { sortOrder: 'asc' } },
    })

    res.json({ classes })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const getClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        gradeLevel:      true,
        classTeacher:    { select: { firstName: true, lastName: true, email: true } },
        academicYear:    true,
        subjectTeachers: { include: { subject: true, teacher: { select: { firstName: true, lastName: true } } } },
        enrollments:     { include: { student: true } },
      },
    })

    if (!cls) { res.status(404).json({ error: 'Class not found' }); return }
    res.json({ class: cls })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const getClassRoster = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params

    const enrollments = await prisma.studentEnrollment.findMany({
      where:   { classId },
      include: { student: true },
      orderBy: { student: { lastName: 'asc' } },
    })

    res.json({ students: enrollments.map(e => e.student) })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, gradeLevelId, academicYearId,
      classTeacherId, roomNumber, capacity,
    } = req.body

    const cls = await prisma.class.create({
      data: { name, gradeLevelId, academicYearId, classTeacherId, roomNumber, capacity },
    })

    res.status(201).json({ message: 'Class created', class: cls })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, roomNumber, capacity, classTeacherId } = req.body

    const cls = await prisma.class.update({
      where: { id },
      data:  { name, roomNumber, capacity, classTeacherId },
    })

    res.json({ message: 'Class updated', class: cls })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}