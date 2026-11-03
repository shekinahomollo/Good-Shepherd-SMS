import { Request, Response } from 'express'
import { prisma }            from '../lib/prisma'
import { asString, firstQueryValue } from '../utils/query'

// ── GET /api/announcements ────────────────────────────────────
export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const audience = firstQueryValue(req.query.audience)
    const classId = firstQueryValue(req.query.classId)

    const announcements = await prisma.announcement.findMany({
      where: {
        isPublished: true,
        ...(audience ? { audience: audience as any } : {}),
        ...(classId ? { targetClassId: classId } : {}),
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      include: {
        createdBy: { select: { firstName: true, lastName: true, role: true } },
        reads:     { select: { userId: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ announcements })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── POST /api/announcements ───────────────────────────────────
export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = asString((req as any).user?.userId)
    const {
      title, body, audience, targetClassId,
      publishAt, expiresAt, isPublished,
    } = req.body

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        createdById:    userId,
        audience:       audience || 'ALL',
        targetClassId:  targetClassId || null,
        publishAt:      publishAt  ? new Date(publishAt)  : null,
        expiresAt:      expiresAt  ? new Date(expiresAt)  : null,
        isPublished:    isPublished ?? true,
      },
    })

    res.status(201).json({ message: 'Announcement created', announcement })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── PATCH /api/announcements/:id/read ────────────────────────
export const markRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = asString(req.params.id)
    const userId = asString((req as any).user?.userId)

    const existingRead = await prisma.announcementRead.findFirst({
      where: { announcementId: id, userId },
    })

    if (existingRead) {
      await prisma.announcementRead.update({
        where: { id: existingRead.id },
        data: {},
      })
    } else {
      await prisma.announcementRead.create({
        data: { announcementId: id, userId },
      })
    }

    res.json({ message: 'Marked as read' })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── DELETE /api/announcements/:id ────────────────────────────
export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = asString(req.params.id)
    await prisma.announcement.delete({ where: { id } })
    res.json({ message: 'Announcement deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}