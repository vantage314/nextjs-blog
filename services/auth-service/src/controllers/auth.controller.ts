import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { logger } from '../utils/logger';
import { config } from '../config';

export class AuthController {
  // 用户注册
  public async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone } = req.body;

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '该邮箱已被注册'
        });
      }

      // 创建新用户
      const user = new User({
        email,
        password,
        name,
        phone
      });

      await user.save();

      // 生成JWT token
      const token = jwt.sign(
        { userId: user._id },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      logger.error('注册失败', { error });
      res.status(500).json({
        success: false,
        message: '注册失败，请稍后重试'
      });
    }
  }

  // 用户登录
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '邮箱或密码错误'
        });
      }

      // 验证密码
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: '邮箱或密码错误'
        });
      }

      // 检查用户状态
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: '账号已被禁用'
        });
      }

      // 更新最后登录时间
      user.lastLogin = new Date();
      await user.save();

      // 生成JWT token
      const token = jwt.sign(
        { userId: user._id },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      logger.error('登录失败', { error });
      res.status(500).json({
        success: false,
        message: '登录失败，请稍后重试'
      });
    }
  }

  // 获取当前用户信息
  public async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin
          }
        }
      });
    } catch (error) {
      logger.error('获取用户信息失败', { error });
      res.status(500).json({
        success: false,
        message: '获取用户信息失败'
      });
    }
  }

  // 更新用户信息
  public async updateProfile(req: Request, res: Response) {
    try {
      const { name, phone, avatar } = req.body;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 更新用户信息
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;

      await user.save();

      res.json({
        success: true,
        message: '更新成功',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role
          }
        }
      });
    } catch (error) {
      logger.error('更新用户信息失败', { error });
      res.status(500).json({
        success: false,
        message: '更新失败，请稍后重试'
      });
    }
  }

  // 修改密码
  public async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 验证当前密码
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: '当前密码错误'
        });
      }

      // 更新密码
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: '密码修改成功'
      });
    } catch (error) {
      logger.error('修改密码失败', { error });
      res.status(500).json({
        success: false,
        message: '修改失败，请稍后重试'
      });
    }
  }
} 