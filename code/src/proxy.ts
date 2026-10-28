import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

import { defaultLocale } from '@/config/locale';
import { routing } from '@/core/i18n/config';
import {
  indexableQuizboardSeoSlugs,
  quizboardSeoRedirects,
} from '@/shared/blocks/quizboard/seo-pages';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(locale as any);
  const pathWithoutLocale = isValidLocale
    ? pathname.slice(locale.length + 1)
    : pathname;
  const normalizedPath = pathWithoutLocale || '/';
  const requestedSlug = normalizedPath.replace(/^\//, '');
  const canonicalSlug =
    quizboardSeoRedirects[requestedSlug] ||
    (indexableQuizboardSeoSlugs.includes(
      requestedSlug as (typeof indexableQuizboardSeoSlugs)[number]
    )
      ? requestedSlug
      : null);

  // The public product landing pages are English-only for now. Redirecting
  // their duplicate /zh URLs is more explicit than relying on canonical tags
  // for pages that contain the same English content.
  if (locale === 'zh' && (normalizedPath === '/' || canonicalSlug)) {
    const destination = canonicalSlug ? `/${canonicalSlug}` : '/';
    return NextResponse.redirect(new URL(destination, request.url), 308);
  }

  // Consolidate keyword variants and pages for unavailable features. A 308 is
  // a definitive signal to Google and preserves any future external links.
  if (canonicalSlug && canonicalSlug !== requestedSlug) {
    return NextResponse.redirect(
      new URL(`/${canonicalSlug}`, request.url),
      308
    );
  }

  // Keep the default locale as an internal rewrite for unprefixed URLs. A
  // redirect from /en back to / would run again after the rewrite and create a
  // loop in Next's proxy pipeline, so canonical metadata handles that alias.
  const response = isValidLocale
    ? NextResponse.next()
    : (() => {
        const localizedUrl = request.nextUrl.clone();
        localizedUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(localizedUrl);
      })();

  // Only check authentication for admin routes
  if (
    pathWithoutLocale.startsWith('/admin') ||
    pathWithoutLocale.startsWith('/settings') ||
    pathWithoutLocale.startsWith('/activity')
  ) {
    // Check if session cookie exists
    const sessionCookie = getSessionCookie(request);

    // If no session token found, redirect to sign-in
    if (!sessionCookie) {
      const signInUrl = new URL(
        isValidLocale ? `/${locale}/sign-in` : '/sign-in',
        request.url
      );
      // Add the current path (including search params) as callback - use relative path for multi-language support
      const callbackPath = pathWithoutLocale + request.nextUrl.search;
      signInUrl.searchParams.set('callbackUrl', callbackPath);
      return NextResponse.redirect(signInUrl);
    }

    // For admin routes, we need to check RBAC permissions
    // Note: Full permission check happens in the page/API route level
    // This is a lightweight session check to prevent unauthorized access
    // The detailed permission check (admin.access and specific permissions)
    // will be done in the layout or individual pages using requirePermission()
  }

  response.headers.set('x-pathname', request.nextUrl.pathname);
  response.headers.set('x-url', request.url);

  // Remove Set-Cookie from public pages to allow caching
  // We exclude admin, settings, activity, and auth pages from this behavior
  if (
    !pathWithoutLocale.startsWith('/admin') &&
    !pathWithoutLocale.startsWith('/settings') &&
    !pathWithoutLocale.startsWith('/activity') &&
    !pathWithoutLocale.startsWith('/sign-') &&
    !pathWithoutLocale.startsWith('/auth')
  ) {
    response.headers.delete('Set-Cookie');

    // Cache-Control header for public pages
    const cacheControl = 'public, s-maxage=3600, stale-while-revalidate=14400';

    response.headers.set('Cache-Control', cacheControl);
    response.headers.set('CDN-Cache-Control', cacheControl);
    response.headers.set('Cloudflare-CDN-Cache-Control', cacheControl);
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
