import React from 'react';
import { checkPasswordStrength, PasswordStrength } from '@/lib/utils/passwordStrength';

/**
 * 密码强度提示组件
 * @param password 用户输入的密码
 */
export interface PasswordStrengthIndicatorProps {
  password: string;
}

const strengthColor: Record<PasswordStrength, string> = {
  weak: 'text-red-500',
  medium: 'text-yellow-500',
  strong: 'text-green-600',
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { strength, message } = checkPasswordStrength(password);

  return (
    <div className="mt-1 text-sm flex items-center gap-2">
      <span className={`font-bold ${strengthColor[strength]}`}>{
        strength === 'weak' ? '弱' : strength === 'medium' ? '中' : '强'
      }</span>
      <span className="text-gray-500">{message}</span>
    </div>
  );
};

export { checkPasswordStrength }; 