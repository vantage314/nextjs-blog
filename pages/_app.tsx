import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { startNotificationMock } from '@/lib/mock/notificationMock';
import { useTheme } from '@/hooks/useTheme';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { applyCompatibilityStyles } from '@/lib/utils/compatibility';
import '@/styles/compatibility.css';

// 配置 NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { algorithm } = useTheme();

  // 应用兼容性样式
  useEffect(() => {
    applyCompatibilityStyles();
  }, []);

  // 路由变化时显示加载进度
  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  // 仅在开发环境启动 Mock
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const cleanup = startNotificationMock();
      return cleanup;
    }
  }, []);

  return (
    <ConfigProvider
      theme={{ algorithm }}
      locale={settings.language === 'zh_CN' ? zhCN : enUS}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp; 