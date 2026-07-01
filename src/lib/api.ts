
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventwaversion3-production.up.railway.app/api';

export const api = {
  async post(endpoint: string, data: any, token?: string) {
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

  async get(endpoint: string, params?: Record<string, any>, token?: string) {
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

    return response.json();
  },

  async put(endpoint: string, data: any, token?: string) {
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
    // Clean up potential double slashes
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
