'use client';

type AnalyticsValue = boolean | number | string;
type EventParams = Record<string, AnalyticsValue | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: Record<string, AnalyticsValue>
    ) => void;
  }
}

/**
 * Send only product-funnel metadata. User-entered topics, questions, feedback,
 * and identifiers must never be added here because they can contain class or
 * training material.
 */
export function trackQuizboardEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;

  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, AnalyticsValue>;

  window.dispatchEvent(
    new CustomEvent('quizboard:analytics', {
      detail: { name, params: safeParams },
    })
  );
  window.gtag?.('event', name, safeParams);
}
