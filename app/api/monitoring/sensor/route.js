import { NextResponse } from 'next/server';
import { MOCK_SENSORS } from '@/app/data/mock';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json({ 
    code: 200, 
    data: MOCK_SENSORS 
  });
}