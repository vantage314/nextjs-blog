/**
 * 音频上下文单例
 */
let audioContext: AudioContext | null = null;

/**
 * 获取音频上下文
 */
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * 播放提示音
 */
export const playNotificationSound = async () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // 设置音调
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.setValueAtTime(440, ctx.currentTime + 0.1); // A4

    // 设置音量
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 播放
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (error) {
    console.error('播放提示音失败:', error);
  }
};

/**
 * 预加载音频
 */
export const preloadAudio = async () => {
  try {
    const ctx = getAudioContext();
    await ctx.resume();
  } catch (error) {
    console.error('预加载音频失败:', error);
  }
}; 