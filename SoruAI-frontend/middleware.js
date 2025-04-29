import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is for protected exam routes
  const isExamRoute = path.match(/^\/exams\/[^\/]+(\/(review)?)?$/);
  
  const token = request.cookies.get('token')?.value;
  
  if (isExamRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/exams/:id', '/exams/:id/review']
};