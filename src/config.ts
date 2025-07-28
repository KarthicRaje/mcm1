// src/config.ts
// =====================================================================================
// IMPORTANT: These values have been configured with the keys you provided.
// The VAPID Private Key is NOT stored here; it must be set as a secret in your Supabase project.
// =====================================================================================
//
// This file is used to configure the application.
//
// WARNING: For a real production deployment, it is highly recommended to use environment
// variables instead of hardcoding keys in the source code. This method is provided for
// ease of use in environments where .env files are not available.

/**
 * Your Supabase Project URL.
 * Found in your Supabase project's "Settings > API".
 */
export const SUPABASE_URL = 'https://xmspqtqooufngsjnljek.supabase.co';

/**
 * Your Supabase "anon" public key.
 * Found in your Supabase project's "Settings > API".
 */
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc3BxdHFvb3Vmbmdzam5samVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDczNzgsImV4cCI6MjA2OTI4MzM3OH0.sJKKZuLL1gROqZCloqWIqC-INT8elhSGB-jPXbIxkyE';

/**
 * Your VAPID Public Key for Web Push notifications.
 * You can generate one at https://web-push-codelab.glitch.me/
 */
export const VAPID_PUBLIC_KEY = 'BP7_fiqB7nNL3pxcvgXDqzoFrzL4ab37XSZUV0H2sMwKC5mvvFFz7NjTXixl8e_5zoQqFZwbc3a60D0GAnxeGqA';