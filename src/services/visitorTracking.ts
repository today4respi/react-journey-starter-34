import axios from 'axios';

const API_URL = 'https://www.respizenmedical.com/mylittle/api/track_visitors.php';
const MAX_RETRIES = 2;
const RETRY_DELAY = 40000; // 40 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const defaultCountries = ['Tunisia', 'France', 'United States'];
const getRandomCountry = () => defaultCountries[Math.floor(Math.random() * defaultCountries.length)];

interface VisitorData {
  page_visitors: string;
  referrer?: string;
  user_location?: {
    country: string;
    city?: string;
    ip?: string;
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data?: {
    ip: string;
    city: string;
    country: string;
    page: string;
    referrer?: string;
    date: string;
  };
}

// Gets user location from ipwho.is and ensures country is never null
const getVisitorLocation = async (): Promise<{ country: string; city?: string; ip?: string }> => {
  try {
    const response = await axios.get('https://ipwho.is/', { timeout: 3000 });

    if (response.data && response.data.success) {
      const country = response.data.country || getRandomCountry();
      const city = response.data.city || 'Unknown City';
      const ip = response.data.ip || '0.0.0.0';

      return { country, city, ip };
    } else {
      throw new Error('ipwho.is returned unsuccessful result');
    }

  } catch (error) {
    console.warn('ipwho.is failed, using fallback:', error);
    return {
      country: getRandomCountry(),
      city: 'Tunis',
      ip: '0.0.0.0'
    };
  }
};

// Referrer detection
const getReferrerSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return 'Direct';

  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname.toLowerCase();

    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'Facebook';
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'Twitter/X';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (hostname.includes('youtube.com')) return 'YouTube';
    if (hostname.includes('pinterest.com')) return 'Pinterest';
    if (hostname.includes('lovable.dev')) return 'Lovable';

    if (hostname.includes('google.')) return 'Google Search';
    if (hostname.includes('bing.com')) return 'Bing Search';
    if (hostname.includes('yahoo.com')) return 'Yahoo Search';
    if (hostname.includes('duckduckgo.com')) return 'DuckDuckGo Search';

    if (
      hostname.includes('gmail.com') ||
      hostname.includes('outlook.com') ||
      hostname.includes('yahoo.com')
    ) {
      return 'Email';
    }

    return hostname;

  } catch (err) {
    console.warn('Error parsing referrer URL:', err);
    return referrer;
  }
};

// Main visitor tracking
export const trackVisitor = async (pageName: string, retryCount = 0): Promise<void> => {
  try {
    console.log(`Tracking visit to: ${pageName}`);

    const referrerSource = getReferrerSource();
    if (referrerSource === 'Lovable') {
      console.log('Skipping tracking - referrer is Lovable');
      return;
    }

    const locationData = await getVisitorLocation();

    const visitorData: VisitorData = {
      page_visitors: pageName,
      referrer: referrerSource,
      user_location: locationData
    };

    console.log('Sending visitor data:', visitorData);

    const response = await axios.post<ApiResponse>(API_URL, visitorData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 8000
    });

    if (response.data.status === 'success') {
      console.log(`Visit tracked successfully from ${locationData.country}`);
    } else {
      throw new Error(response.data.message || 'Unknown error');
    }

  } catch (error) {
    console.error(`Error tracking visit to ${pageName}:`, error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying tracking (${retryCount + 1}/${MAX_RETRIES}) after delay...`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return trackVisitor(pageName, retryCount + 1);
    }
  }
};
