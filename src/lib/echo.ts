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
const echo = new Echo({
  // CHANGED: broadcaster changed from 'reverb' to 'pusher'
  broadcaster: 'pusher',
  // CHANGED: key now reads from VITE_PUSHER_APP_KEY instead of VITE_REVERB_APP_KEY
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  // CHANGED: cluster replaces wsHost/wsPort/wssPort/forceTLS/enabledTransports —
  // Pusher's hosted infrastructure handles routing based on cluster alone
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  // Authenticate private channels via the Laravel Sanctum token
  authEndpoint: `${import.meta.env.VITE_API_BASE_URL ?? ''}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      Accept: 'application/json',
    },
  },
});

export default echo;
