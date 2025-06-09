import Joi from 'joi';

// 注册验证
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '邮箱格式不正确',
      'any.required': '邮箱是必填项'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': '密码长度不能小于6位',
      'any.required': '密码是必填项'
    }),
  name: Joi.string()
    .required()
    .messages({
      'any.required': '姓名是必填项'
    }),
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .messages({
      'string.pattern.base': '手机号格式不正确'
    })
});

// 登录验证
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '邮箱格式不正确',
      'any.required': '邮箱是必填项'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': '密码是必填项'
    })
});

// 更新个人信息验证
export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .messages({
      'string.base': '姓名必须是字符串'
    }),
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .messages({
      'string.pattern.base': '手机号格式不正确'
    }),
  avatar: Joi.string()
    .uri()
    .messages({
      'string.uri': '头像URL格式不正确'
    })
});

// 修改密码验证
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': '当前密码是必填项'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': '新密码长度不能小于6位',
      'any.required': '新密码是必填项'
    })
}); 