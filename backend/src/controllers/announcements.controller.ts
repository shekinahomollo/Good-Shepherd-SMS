import { Request, Response } from 'express'
import { prisma }            from '../lib/prisma'

// ── GET /api/announcements ────────────────────────────────────
export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { audience, classId } = req.query

    const announcements = await prisma.announcement.findMany({
      where: {
        isPublished: true,
        ...(audience ? { audience: audience as any } : {}),
        ...(classId  ? { targetClassId: classId as string } : {}),
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
    const { userId }  = (req as any).user
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
    const { id }     = req.params
    const { userId } = (req as any).user

    await prisma.announcementRead.upsert({
      where:  { id: (await prisma.announcementRead.findFirst({ where: { announcementId: id, userId } }))?.id || '' },
      update: {},
      create: { announcementId: id, userId },
    })

    res.json({ message: 'Marked as read' })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}

// ── DELETE /api/announcements/:id ────────────────────────────
export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    await prisma.announcement.delete({ where: { id } })
    res.json({ message: 'Announcement deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err })
  }
}