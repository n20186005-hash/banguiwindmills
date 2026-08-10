/**
 * 站点配置 — 单点配置，全站域名来源
 *
 * 域名解析优先级：
 *   1. 环境变量 CURRENT_SITE_DOMAIN（构建时注入）
 *   2. 回退空字符串（域名未确定时优雅降级，不阻断构建）
 *
 *   site 为空时：
 *     - canonical / OG / JSON-LD 的绝对 URL 改用相对路径或省略
 *     - sitemap 集成仅在 site 有值时启用（见 astro.config.mjs）
 *
 * 正式部署时只需设置环境变量或填入域名，重新构建即可。
 */
function resolveBaseUrl(): string {
  // Read from process.env (Node.js runtime) or import.meta.env (Vite/Astro)
  const raw: string | undefined =
    typeof process !== 'undefined'
      ? process.env.CURRENT_SITE_DOMAIN
      : undefined;
  if (!raw) return '';
  const host = String(raw).replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return `https://${host}`;
}

export const siteConfig = {
  name: 'Bangui Windmills',
  baseUrl: resolveBaseUrl(),
} as const;

/**
 * 获取站点基础 URL。若未配置域名则返回空字符串，调用方应据此决定是否输出绝对 URL。
 */
export function getBaseUrl(): string {
  // 允许构建时环境变量注入
  return siteConfig.baseUrl;
}

// ===== 景点数据 =====

export const mapsUrl = 'https://maps.app.goo.gl/6rStRyytritErtFk6';

export const attraction = {
  name: 'Bangui Windmills',
  nameLocal: 'Bangui Windmills',
  description:
    'The first wind farm in Southeast Asia, featuring 20 towering wind turbines stretched along the picturesque coastline of Bangui Bay in Ilocos Norte, Philippines.',
  rating: '4.7',
  reviewCount: '1,486',
  lat: 18.5285706,
  lng: 120.7181102,
  plusCode: 'GPH9+C6H',
  address: 'Bangui Bay, Bangui, Ilocos Norte, 2920 Philippines',
  telephone: '',
  openingHours: 'Open 24 hours',
  touristType: 'Wind Farm / Scenic Viewpoint',
} as const;

export default siteConfig;
