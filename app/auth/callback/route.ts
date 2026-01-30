import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      console.log('🔐 Exchanging code for session...');
      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('❌ Exchange error:', exchangeError);
        return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url));
      }

      console.log('✓ Session established successfully');
      // Redirect to setup page to create profile
      return NextResponse.redirect(new URL('/auth/setup', request.url));
    } catch (err) {
      console.error('❌ Callback error:', err);
      return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
    }
  }

  // No code provided
  return NextResponse.redirect(new URL('/login?error=no_code', request.url));
}
