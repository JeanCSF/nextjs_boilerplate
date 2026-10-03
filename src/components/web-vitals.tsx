'use client';

import { useReportWebVitals } from 'next/web-vitals';

type WebVitalsMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

function reportWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.info(`${metric.name}: ${metric.value}`);
  }
}

export function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
