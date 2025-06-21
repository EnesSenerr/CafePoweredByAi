import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Backend API'ya isteği yönlendir
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${backendUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Token geçersiz' }, { status: 401 });
    }

    const userData = await response.json();
    
    // Backend'in farklı response formatlarını handle et
    const user = userData.user || userData.data || userData;
    
    return NextResponse.json({
      id: user.id || user._id,
      name: user.name || user.username,
      email: user.email,
    });
    
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 