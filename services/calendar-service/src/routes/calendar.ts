import { Router } from 'express';
import { CalendarService } from '../services/CalendarService';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { eventSchema } from '../schemas/event';

const router = Router();
const calendarService = new CalendarService();

// 获取事件列表
router.get(
  '/events',
  authMiddleware,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const events = await calendarService.getUserEvents(
        req.user.id,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: '获取事件列表失败' });
    }
  }
);

// 创建事件
router.post(
  '/events',
  authMiddleware,
  validateRequest(eventSchema),
  async (req, res) => {
    try {
      const event = await calendarService.createEvent({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: '创建事件失败' });
    }
  }
);

// 更新事件
router.put(
  '/events/:id',
  authMiddleware,
  validateRequest(eventSchema),
  async (req, res) => {
    try {
      const event = await calendarService.updateEvent(
        req.params.id,
        req.user.id,
        req.body
      );
      if (!event) {
        return res.status(404).json({ error: '事件不存在' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: '更新事件失败' });
    }
  }
);

// 删除事件
router.delete(
  '/events/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const success = await calendarService.deleteEvent(
        req.params.id,
        req.user.id
      );
      if (!success) {
        return res.status(404).json({ error: '事件不存在' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: '删除事件失败' });
    }
  }
);

// 导入事件
router.post(
  '/events/import',
  authMiddleware,
  async (req, res) => {
    try {
      const events = await calendarService.importEvents(
        req.user.id,
        req.body.events
      );
      res.status(201).json(events);
    } catch (error) {
      res.status(500).json({ error: '导入事件失败' });
    }
  }
);

// 导出事件
router.get(
  '/events/export',
  authMiddleware,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const events = await calendarService.exportEvents(
        req.user.id,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: '导出事件失败' });
    }
  }
);

export default router; 