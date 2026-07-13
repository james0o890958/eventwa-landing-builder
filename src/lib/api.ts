export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventwaversion3-production.up.railway.app/api';

export const getFullAvatarUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;

  const apiBase = import.meta.env.VITE_API_BASE_URL || API_BASE_URL || "";
  const baseUrl = apiBase.replace(/\/api$/, "");
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  let cleanUrl = url;
  if (cleanUrl.includes("localhost:") || cleanUrl.includes("127.0.0.1:")) {
    cleanUrl = cleanUrl.replace(/^https?:\/\/[^\/]+/, "");
  } else if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  const cleanPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  return `${cleanBase}${cleanPath}`;
};

// In-memory TTL Cache and in-flight request deduplication store
interface CacheEntry {
  timestamp: number;
  data: any;
}

const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<any>>();

export interface ApiGetOptions {
  bypassCache?: boolean;
  ttlMs?: number; // Custom Time-To-Live in milliseconds (default: 3 mins)
}

const DEFAULT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export const api = {
  clearCache(endpointPrefix?: string) {
    if (!endpointPrefix) {
      responseCache.clear();
      return;
    }
    for (const key of responseCache.keys()) {
      if (key.includes(endpointPrefix)) {
        responseCache.delete(key);
      }
    }
  },

  prewarmBackend() {
    // Non-blocking ping to prevent Render free-tier cold-start latency
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    fetch(`${cleanBaseUrl}/public/events`, { method: 'GET' }).catch(() => {});
  },

  async post(endpoint: string, data: any, token?: string) {
    // Invalidate cached GET endpoints after mutations
    this.clearCache();

    // Clean up potential double slashes
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawMessage = errorData.message || errorData.error || errorData.error_description || errorData.detail;
      const parsedMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
      const err: any = new Error(parsedMessage || `API request failed with status ${response.status}`);
      err.data = errorData;
      throw err;
    }

    return response.json();
  },

  async get(endpoint: string, params?: Record<string, any>, token?: string, options?: ApiGetOptions) {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Clean up potential double slashes
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${cleanBaseUrl}${cleanEndpoint}`;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const cacheKey = `${token || 'guest'}:${url}`;
    const ttl = options?.ttlMs ?? DEFAULT_CACHE_TTL;

    // 1. Check cached response
    if (!options?.bypassCache && responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
      responseCache.delete(cacheKey);
    }

    // 2. Reuse in-flight promise to avoid duplicate simultaneous network requests
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const rawMessage = errorData.message || errorData.error || errorData.error_description || errorData.detail;
          const parsedMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          throw new Error(parsedMessage || `API request failed with status ${response.status}`);
        }

        const data = await response.json();
        // Store in cache
        responseCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  },

  async put(endpoint: string, data: any, token?: string) {
    this.clearCache();
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawMessage = errorData.message || errorData.error || errorData.error_description || errorData.detail;
      const parsedMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
      throw new Error(parsedMessage || `API request failed with status ${response.status}`);
    }

    return response.json();
  },

  async delete(endpoint: string, token?: string) {
    this.clearCache();
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawMessage = errorData.message || errorData.error || errorData.error_description || errorData.detail;
      const parsedMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
      throw new Error(parsedMessage || `API request failed with status ${response.status}`);
    }

    return response.json();
  },

  async patch(endpoint: string, data: any, token?: string) {
    this.clearCache();
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawMessage = errorData.message || errorData.error || errorData.error_description || errorData.detail;
      const parsedMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
      throw new Error(parsedMessage || `API request failed with status ${response.status}`);
    }

    return response.json();
  }
};
