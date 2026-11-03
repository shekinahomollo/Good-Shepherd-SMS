import { Request, Response }  from 'express'
import { prisma }             from '../lib/prisma'
import { asString, firstQueryValue } from '../utils/query'

// ── POST /api/attendance/sessions ─────────────────────────────
// Teacher marks attendance for their class for a given date
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, sessionDate, sessionType = 'FULL_DAY', records } = req.body
    const userId = asString((req as any).user?.userId)

    // records = [{ studentId, status, notes? }]
    const typedRecords = Array.isArray(records)
      ? records as Array<{ studentId: string; status: string; notes?: string | null }>
      : []

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
    const upserts = typedRecords.map((r) =>
      prisma.attendanceRecord.upsert({
        where: {
          sessionId_studentId: {
            sessionId: session.id,
            studentId: r.studentId,
          },
        },
        update: { status: r.status as any, notes: r.notes ?? null },
        create: {
          sessionId: session.id,
          studentId: r.studentId,
          status: r.status as any,
          notes: r.notes ?? null,
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
    const classId = firstQueryValue(req.query.classId)
    const date = firstQueryValue(req.query.date)
    const sessionType = (firstQueryValue(req.query.sessionType) as any) || 'FULL_DAY'

    const session = await prisma.attendanceSession.findUnique({
      where: {
        classId_sessionDate_sessionType: {
          classId: classId || '',
          sessionDate: date ? new Date(date) : new Date(),
          sessionType,
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
    const classId = asString(req.params.classId)
    const month = Number(firstQueryValue(req.query.month) || 1)
    const year = Number(firstQueryValue(req.query.year) || new Date().getFullYear())

    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0)

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
    const studentId = asString(req.params.studentId)
    const termStart = firstQueryValue(req.query.termStart)
    const termEnd = firstQueryValue(req.query.termEnd)

    const records = await prisma.attendanceRecord.findMany({
      where: {
        studentId,
        session: {
          sessionDate: {
            gte: termStart ? new Date(termStart) : undefined,
            lte: termEnd ? new Date(termEnd) : undefined,
          },
        },
      },
      include: { session: true },
      orderBy: { session: { sessionDate: 'asc' } },
    })

    const total = records.length
    const present = records.filter((r: { status: string }) => r.status === 'PRESENT').length
    const absent = records.filter((r: { status: string }) => r.status === 'ABSENT').length
    const late = records.filter((r: { status: string }) => r.status === 'LATE').length
    const excused = records.filter((r: { status: string }) => r.status === 'EXCUSED').length
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0

    res.json({
      summary: { total, present, absent, late, excused, percentage: pct },
      records,
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}