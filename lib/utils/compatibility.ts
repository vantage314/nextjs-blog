/**
 * 检测浏览器是否支持 CSS 动画
 */
export const supportsAnimation = (): boolean => {
  return 'animation' in document.documentElement.style ||
    'WebkitAnimation' in document.documentElement.style ||
    'MozAnimation' in document.documentElement.style ||
    'OAnimation' in document.documentElement.style ||
    'msAnimation' in document.documentElement.style;
};

/**
 * 检测浏览器是否支持 CSS 过渡
 */
export const supportsTransition = (): boolean => {
  return 'transition' in document.documentElement.style ||
    'WebkitTransition' in document.documentElement.style ||
    'MozTransition' in document.documentElement.style ||
    'OTransition' in document.documentElement.style ||
    'msTransition' in document.documentElement.style;
};

/**
 * 检测浏览器是否支持 Flexbox
 */
export const supportsFlexbox = (): boolean => {
  return 'flex' in document.documentElement.style ||
    'WebkitFlex' in document.documentElement.style ||
    'MozFlex' in document.documentElement.style ||
    'OFlex' in document.documentElement.style ||
    'msFlex' in document.documentElement.style;
};

/**
 * 检测浏览器是否支持 Grid
 */
export const supportsGrid = (): boolean => {
  return 'grid' in document.documentElement.style ||
    'WebkitGrid' in document.documentElement.style ||
    'MozGrid' in document.documentElement.style ||
    'OGrid' in document.documentElement.style ||
    'msGrid' in document.documentElement.style;
};

/**
 * 获取浏览器兼容性信息
 */
export const getBrowserCompatibility = () => {
  return {
    animation: supportsAnimation(),
    transition: supportsTransition(),
    flexbox: supportsFlexbox(),
    grid: supportsGrid(),
  };
};

/**
 * 应用兼容性样式
 */
export const applyCompatibilityStyles = () => {
  const compatibility = getBrowserCompatibility();
  
  // 如果不支持动画，添加 no-animation 类
  if (!compatibility.animation) {
    document.documentElement.classList.add('no-animation');
  }
  
  // 如果不支持过渡，添加 no-transition 类
  if (!compatibility.transition) {
    document.documentElement.classList.add('no-transition');
  }
  
  // 如果不支持 Flexbox，添加 no-flexbox 类
  if (!compatibility.flexbox) {
    document.documentElement.classList.add('no-flexbox');
  }
  
  // 如果不支持 Grid，添加 no-grid 类
  if (!compatibility.grid) {
    document.documentElement.classList.add('no-grid');
  }
}; 