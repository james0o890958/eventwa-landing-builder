import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally (required by Laravel Echo)
(window as any).Pusher = Pusher;

/**
 * Laravel Echo instance configured for Pusher Channels.
 * // CHANGED: Switched from self-hosted Reverb to hosted Pusher Channels
 * // CHANGED: Reason: Render free tier can't run a persistent Reverb WebSocket process
 *
 * Required .env variables in eventwa-landing-builder:
 *   VITE_PUSHER_APP_KEY=your-pusher-app-key
 *   VITE_PUSHER_APP_CLUSTER=your-pusher-cluster   (e.g. mt1, us2, eu)
 *   VITE_API_BASE_URL=...                          (already set)
 *
 * No local process needed — Pusher is a hosted service.
 * Get these values from: https://dashboard.pusher.com/apps/YOUR_APP_ID/keys
 */
const echoKey = import.meta.env.VITE_PUSHER_APP_KEY;

const echo = echoKey
  ? new Echo({
      broadcaster: 'pusher',
      key: echoKey,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
      forceTLS: true,
      authEndpoint: `${(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/api\/?$/, '')}/broadcasting/auth`,
      authorizer: (channel: any) => ({
        authorize: (socketId: string, callback: Function) => {
          const token = localStorage.getItem('access_token') || localStorage.getItem('admin_token') || '';
          fetch(`${(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/api\/?$/, '')}/broadcasting/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then((res) => res.json())
            .then((data) => callback(null, data))
            .catch((err) => callback(err));
        },
      }),
    })
  : null;

export default echo;
