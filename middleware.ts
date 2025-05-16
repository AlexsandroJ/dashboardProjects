import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();

  // Verifica se a rota é /profile ou /dashboard
  if (
    req.nextUrl.pathname.startsWith('/no') ||
    req.nextUrl.pathname.startsWith('/noo')
  ) {
    if (!token) {
      url.pathname = '/auth';
      return NextResponse.rewrite(url);
    }
  }
  console.log('Middleware executado para:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/no/:path*', '/noo/:path*'], // Adicione aqui as rotas protegidas
};