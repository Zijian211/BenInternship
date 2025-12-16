import { NextResponse } from 'next/server';
import { MOCK_INVERTERS } from '@/app/data/mock';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Slight delay for realism

  return NextResponse.json({
    success: true,
    data: MOCK_INVERTERS,
    timestamp: new Date().toISOString(),
  });
}