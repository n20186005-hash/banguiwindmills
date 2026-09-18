import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/config';

const hasSite = !!siteConfig.baseUrl;

// https://astro.build/config
export default defineConfig({
  ...(hasSite ? { site: siteConfig.baseUrl } : {}),
  trailingSlash: 'ignore',
  integrations: hasSite
    ? [
        sitemap({
          // 多语言站点：输出 xhtml:link hreflang 交替链接
          i18n: {
            defaultLocale: 'fil',
            locales: {
              fil: 'fil-PH',
              en: 'en-US',
              zh: 'zh-CN',
            },
          },
          // 排除重定向页（根路径 301 到 /fil/、/km/ 旧路径），避免收录非内容页
          filter: (page) => {
            const { pathname } = new URL(page);
            return pathname !== '/' && !pathname.startsWith('/km/');
          },
        }),
      ]
    : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
