import { Request, Response } from 'express'
import { prisma }            from '../lib/prisma'

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, gradeLevel } = req.query

    const students = await prisma.student.findMany({
      where: {
        isActive: true,
        ...(search ? {
          OR: [
            { firstName: { contains: search as string, mode: 'insensitive' } },
            { lastName:  { contains: search as string, mode: 'insensitive' } },
            { admissionNumber: { contains: search as string, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: {
        enrollments: {
          include: {
            class:       { include: { gradeLevel: true } },
            academicYear: true,
          },
          orderBy: { enrollmentDate: 'desc' },
          take: 1,
        },
        parentLinks: {
          include: { parent: { select: { firstName: true, lastName: true, email: true } } },
        },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    })

    res.json({ students })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const getStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { class: { include: { gradeLevel: true } }, academicYear: true },
        },
        parentLinks: {
          include: { parent: { select: { firstName: true, lastName: true, email: true, phone: true } } },
        },
        grades:           { include: { subject: true, term: true }, orderBy: { recordedAt: 'desc' } },
        attendanceRecords: { include: { session: true }, orderBy: { session: { sessionDate: 'desc' } }, take: 30 },
      },
    })

    if (!student) { res.status(404).json({ error: 'Student not found' }); return }
    res.json({ student })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName, lastName, admissionNumber, dateOfBirth,
      gender, photoUrl, classId, academicYearId,
    } = req.body

    const student = await prisma.student.create({
      data: {
        firstName, lastName, admissionNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender, photoUrl,
      },
    })

    // Enroll in class if provided
    if (classId && academicYearId) {
      await prisma.studentEnrollment.create({
        data: { studentId: student.id, classId, academicYearId },
      })
    }

    res.status(201).json({ message: 'Student created', student })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { firstName, lastName, photoUrl, isActive } = req.body

    const student = await prisma.student.update({
      where: { id },
      data:  { firstName, lastName, photoUrl, isActive },
    })

    res.json({ message: 'Student updated', student })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

export const toggleStudentActive = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const current = await prisma.student.findUnique({ where: { id } })
    if (!current) { res.status(404).json({ error: 'Student not found' }); return }

    const student = await prisma.student.update({
      where: { id },
      data:  { isActive: !current.isActive },
    })

    res.json({ message: `Student ${student.isActive ? 'activated' : 'deactivated'}`, student })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}