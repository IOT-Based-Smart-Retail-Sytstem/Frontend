import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
    const userToken = request.cookies.get('token');    
    const userNavigateRoute = request.nextUrl.pathname;

    if (userNavigateRoute === "/login" && userToken) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
    }
    
    
    if (userNavigateRoute.startsWith("/dashboard") && !userToken) {
        return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
    }
    
    return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}