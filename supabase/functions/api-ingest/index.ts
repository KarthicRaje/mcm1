
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'https://esm.sh/web-push@3.6.7';
import { corsHeaders } from './cors.ts';

console.log("Ingest function booting up!");

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const body = await req.json();
    const { type, title, message, priority, site, timestamp } = body;

    if (!type || !title || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const notificationData = {
      type, title, message,
      priority: priority || 'low',
      site: site || 'N/A',
      timestamp: timestamp || new Date().toISOString(),
      comments: [],
    };

    const { data: newNotification, error: insertError } = await supabaseClient
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Send push notifications
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription_object');

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
    } else if (subscriptions && subscriptions.length > 0) {
      
      const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
      const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
      const vapidMailto = Deno.env.get('VAPID_MAILTO');

      if (!vapidPublicKey || !vapidPrivateKey || !vapidMailto) {
        console.error("VAPID keys not configured in Supabase secrets.");
      } else {
        webpush.setVapidDetails(vapidMailto, vapidPublicKey, vapidPrivateKey);

        const pushPayload = JSON.stringify({
          title: newNotification.title,
          message: newNotification.message,
          url: '/dashboard'
        });

        const pushPromises = subscriptions.map((sub: any) => 
          webpush.sendNotification(sub.subscription_object, pushPayload)
            .catch(err => console.error(`Failed to send push to ${sub.id}:`, err.statusCode, err.body))
        );
        
        await Promise.allSettled(pushPromises);
        console.log(`Attempted to send ${subscriptions.length} push notifications.`);
      }
    }
    
    return new Response(JSON.stringify(newNotification), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });

  } catch (error) {
    console.error('Error in ingest function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
