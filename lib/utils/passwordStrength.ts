/**
 * 密码强度检测工具
 * - 规则：长度、大小写、数字、特殊字符
 * - 返回：'weak' | 'medium' | 'strong'，并给出提示信息
 * - 便于前后端复用
 * - 可扩展性好，便于后续规则调整
 */

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  message: string;
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  // 规则参数
  const minLength = 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (!password || password.length < minLength) {
    return {
      strength: 'weak',
      message: '密码长度至少8位，需包含大小写字母、数字和特殊字符中的任意两项',
    };
  }

  const types = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (types <= 1) {
    return {
      strength: 'weak',
      message: '密码需包含大小写字母、数字和特殊字符中的至少两项',
    };
  }

  if (types === 2 || types === 3) {
    return {
      strength: 'medium',
      message: '密码强度中等，建议包含大小写字母、数字和特殊字符',
    };
  }

  if (types === 4) {
    return {
      strength: 'strong',
      message: '密码强度高',
    };
  }

  // 默认弱
  return {
    strength: 'weak',
    message: '密码强度较弱',
  };
} 