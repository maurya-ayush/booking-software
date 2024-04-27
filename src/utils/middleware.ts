import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "~/lib/auth";

export async function middleware(req: NextRequest) {
    // Get the token from the cookie (user-token)
    const token = req.cookies.get("user-token")?.value;

    // Validate the token
    let verifiedToken = null;
    if (token) {
        try {
            verifiedToken = await verifyAuth(token);
        } catch (error) {
            console.error("Error verifying token:", error);
        }
    }

    // If the URL starts with '/login' and the token is invalid, redirect to login
    if (req.nextUrl.pathname.startsWith('/login') && !verifiedToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If the URL includes '/login' and the token is verified, redirect to dashboard
    if (req.nextUrl.pathname.includes('/login') && verifiedToken) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If the token is invalid and the URL starts with '/dashboard', redirect to login
    if (!verifiedToken && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard", "/login"],
};
