import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get the backend URL from environment variable or use default
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    const response = await axios.post(`${BACKEND_URL}/api/chat`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || 'An error occurred while communicating with the backend';

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
