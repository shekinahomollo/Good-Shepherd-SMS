import { Request, Response }  from 'express'
import { prisma }             from '../lib/prisma'

// ── POST /api/attendance/sessions ─────────────────────────────
// Teacher marks attendance for their class for a given date
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, sessionDate, sessionType = 'FULL_DAY', records } = req.body
    const { userId } = (req as any).user

    // records = [{ studentId, status, notes? }]

    // Upsert the session
    const session = await prisma.attendanceSession.upsert({
      where: {
        classId_sessionDate_sessionType: {
          classId,
          sessionDate: new Date(sessionDate),
          sessionType,
        },
      },
      update: { recordedById: userId, recordedAt: new Date() },
      create: {
        classId,
        sessionDate:  new Date(sessionDate),
        sessionType,
        recordedById: userId,
      },
    })

    // Upsert each student record
    const upserts = records.map((r: any) =>
      prisma.attendanceRecord.upsert({
        where: {
          sessionId_studentId: {
            sessionId: session.id,
            studentId: r.studentId,
          },
        },
        update: { status: r.status, notes: r.notes ?? null },
        create: {
          sessionId: session.id,
          studentId: r.studentId,
          status:    r.status,
          notes:     r.notes ?? null,
        },
      })
    )

    await prisma.$transaction(upserts)

    res.json({ message: 'Attendance saved', sessionId: session.id })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/attendance/sessions ──────────────────────────────
// Get session for a class on a specific date
export const getSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, date, sessionType = 'FULL_DAY' } = req.query

    const session = await prisma.attendanceSession.findUnique({
      where: {
        classId_sessionDate_sessionType: {
          classId:     classId as string,
          sessionDate: new Date(date as string),
          sessionType: sessionType as any,
        },
      },
      include: {
        records: {
          include: { student: true },
        },
      },
    })

    res.json({ session })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/attendance/class/:classId ────────────────────────
// Get all sessions for a class (monthly report)
export const getClassAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId }         = req.params
    const { month, year }     = req.query

    const start = new Date(Number(year), Number(month) - 1, 1)
    const end   = new Date(Number(year), Number(month), 0)

    const sessions = await prisma.attendanceSession.findMany({
      where: {
        classId,
        sessionDate: { gte: start, lte: end },
      },
      include: {
        records: {
          include: { student: true },
        },
      },
      orderBy: { sessionDate: 'asc' },
    })

    res.json({ sessions })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── GET /api/attendance/student/:studentId/summary ────────────
// Get attendance summary for one student (for parent view)
export const getStudentSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params
    const { termStart, termEnd } = req.query

    const records = await prisma.attendanceRecord.findMany({
      where: {
        studentId,
        session: {
          sessionDate: {
            gte: new Date(termStart as string),
            lte: new Date(termEnd as string),
          },
        },
      },
      include: { session: true },
      orderBy: { session: { sessionDate: 'asc' } },
    })

    const total   = records.length
    const present = records.filter(r => r.status === 'PRESENT').length
    const absent  = records.filter(r => r.status === 'ABSENT').length
    const late    = records.filter(r => r.status === 'LATE').length
    const excused = records.filter(r => r.status === 'EXCUSED').length
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0

    res.json({
      summary: { total, present, absent, late, excused, percentage: pct },
      records,
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}