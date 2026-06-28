import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // এখানে await যোগ করা হয়েছে
  const cookieStore = await cookies();

  // better-auth uses the prefix configured in auth.js. By default, it stores session tokens.
  const token = cookieStore.get('auragym_session_token')?.value || cookieStore.get('better-auth.session_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 });
  }

  return NextResponse.json({ token });
}