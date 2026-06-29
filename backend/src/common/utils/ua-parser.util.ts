export interface ParsedUA {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'SMART_TV' | 'WEARABLE' | 'UNKNOWN';
  deviceName: string;
}

const MOBILE_RE = /Android.*Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i;
const TABLET_RE = /iPad|Android(?!.*Mobile)|Tablet|Kindle|Silk|PlayBook/i;
const SMART_TV_RE = /SmartTV|AndroidTV|Tizen|webOS|Chromecast|AppleTV|HbbTV/i;
const WEARABLE_RE = /Watch|Wear OS|Tizen.*Watch|watchOS/i;

const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\/([\d.]+)/, 'Edge'],
  [/OPR\/([\d.]+)/, 'Opera'],
  [/Opera\/([\d.]+)/, 'Opera'],
  [/Brave\/([\d.]+)/, 'Brave'],
  [/Vivaldi\/([\d.]+)/, 'Vivaldi'],
  [/SamsungBrowser\/([\d.]+)/, 'Samsung Browser'],
  [/UCBrowser\/([\d.]+)/, 'UC Browser'],
  [/Chrome\/([\d.]+)/, 'Chrome'],
  [/Firefox\/([\d.]+)/, 'Firefox'],
  [/Safari\/([\d.]+)/, 'Safari'],
  [/MSIE ([\d.]+)|Trident\/.*rv:([\d.]+)/, 'Internet Explorer'],
];

const OS: [RegExp, string][] = [
  [/Windows NT 10\.0/, 'Windows 10'],
  [/Windows NT 6\.3/, 'Windows 8.1'],
  [/Windows NT 6\.2/, 'Windows 8'],
  [/Windows NT 6\.1/, 'Windows 7'],
  [/Windows/, 'Windows'],
  [/Mac OS X ([\d_]+)/, 'macOS'],
  [/CrOS [\w]+ ([\d._]+)/, 'Chrome OS'],
  [/Android ([\d.]+)/, 'Android'],
  [/iPhone OS ([\d_]+)/, 'iOS'],
  [/iPad.*OS ([\d_]+)/, 'iPadOS'],
  [/Linux/, 'Linux'],
  [/Ubuntu/, 'Ubuntu'],
  [/Debian/, 'Debian'],
];

export function parseUserAgent(ua?: string | null): ParsedUA {
  if (!ua) {
    return {
      browser: 'Unknown',
      browserVersion: '',
      os: 'Unknown',
      osVersion: '',
      deviceType: 'UNKNOWN',
      deviceName: 'Unknown',
    };
  }

  let deviceType: ParsedUA['deviceType'] = 'DESKTOP';
  if (WEARABLE_RE.test(ua)) deviceType = 'WEARABLE';
  else if (SMART_TV_RE.test(ua)) deviceType = 'SMART_TV';
  else if (TABLET_RE.test(ua)) deviceType = 'TABLET';
  else if (MOBILE_RE.test(ua)) deviceType = 'MOBILE';

  let browser = 'Unknown';
  let browserVersion = '';
  for (const [re, name] of BROWSERS) {
    const match = ua.match(re);
    if (match) {
      browser = name;
      browserVersion = match[2] || match[1] || '';
      break;
    }
  }

  let os = 'Unknown';
  let osVersion = '';
  for (const [re, name] of OS) {
    const match = ua.match(re);
    if (match) {
      os = name;
      osVersion = (match[1] || '').replace(/_/g, '.');
      break;
    }
  }

  let deviceName = deviceType === 'DESKTOP' ? 'Desktop' : deviceType === 'MOBILE' ? 'Mobile' : deviceType === 'TABLET' ? 'Tablet' : deviceType;
  if (deviceType === 'MOBILE') {
    if (/iPhone/.test(ua)) deviceName = 'iPhone';
    else if (/Samsung/.test(ua)) deviceName = 'Samsung';
    else if (/Pixel/.test(ua)) deviceName = 'Google Pixel';
    else if (/OnePlus/.test(ua)) deviceName = 'OnePlus';
    else if (/Xiaomi|Redmi|POCO/.test(ua)) deviceName = 'Xiaomi';
  } else if (deviceType === 'TABLET') {
    if (/iPad/.test(ua)) deviceName = 'iPad';
    else if (/Samsung/.test(ua)) deviceName = 'Samsung Tablet';
  }

  return { browser, browserVersion, os, osVersion, deviceType, deviceName };
}

export function buildDeviceInfo(ua?: string | null): string {
  const p = parseUserAgent(ua);
  if (p.browser === 'Unknown' && p.os === 'Unknown') return 'Unknown Device';
  const parts = [p.deviceName, p.browser, p.os].filter(Boolean);
  if (p.browserVersion) parts[1] += ` ${p.browserVersion}`;
  if (p.osVersion) parts[2] += ` ${p.osVersion}`;
  return parts.join(' · ');
}
