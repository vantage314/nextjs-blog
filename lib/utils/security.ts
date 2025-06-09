import DOMPurify from 'dompurify';
import { message } from 'antd';

// 允许的文件类型
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// 文件大小限制（2MB）
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// 危险文件类型
const DANGEROUS_FILE_TYPES = [
  'application/x-msdownload',
  'application/x-executable',
  'application/x-msdos-program',
  'application/x-javascript',
  'text/javascript',
  'application/javascript',
];

/**
 * 清洗 HTML 内容，防止 XSS 攻击
 */
export const sanitizeHTML = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

/**
 * 验证文件类型和大小
 */
export const validateFile = (file: File): boolean => {
  // 检查文件类型
  if (DANGEROUS_FILE_TYPES.includes(file.type)) {
    message.error('不允许上传可执行文件！');
    return false;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    message.error('不支持的文件类型！');
    return false;
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    message.error('文件大小不能超过 2MB！');
    return false;
  }

  return true;
};

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * 生成安全的文件名
 */
export const generateSafeFileName = (filename: string): string => {
  const ext = getFileExtension(filename);
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}; 