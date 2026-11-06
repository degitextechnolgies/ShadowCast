import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD1Iv7lmIcx_ARNyGNb_5okdAqpq-8BCn0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'shadowcast-b90ea.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'shadowcast-b90ea',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'shadowcast-b90ea.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '430003622030',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:430003622030:web:5d1a39a3db9b3effb939df',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-6630F7J8X9',
}

// Initialize Firebase App as a singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Firebase Analytics safely (SSR / browser compatibility)
export let analytics: Analytics | null = null
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app)
      }
    })
    .catch(() => {
      // Analytics blocked or unsupported in current environment
    })
}

export default app

