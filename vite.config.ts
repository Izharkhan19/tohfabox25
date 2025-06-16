import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate', // Automatically update the service worker
    injectRegister: 'auto', // Inject the service worker registration
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'], // Files to cache
    },
    devOptions: {
      enabled: true // Enable PWA in development for testing
    },
    manifest: {
      name: 'My Gift Hamper App', // Full name of your app
      short_name: 'tohfabox25', // Short name for home screen
      description: 'Discover and create unique gift hampers!',
      theme_color: '#ff6b6b', // Matches your primary color
      background_color: '#fdfaf6', // Matches your light background
      display: 'standalone', // Makes it feel like a native app
      scope: '/', // Scope of your PWA
      start_url: '/', // Starting URL when launched
      icons: [
        {
          src: '/tohfabox25_192.png', // Path to your PWA icon
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/tohfabox25_512.png', // Path to your PWA icon
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/tohfabox25_512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable', // For adaptive icons on Android
        },
      ],
    },
  })
  ],
})
