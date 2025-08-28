// app/login/page.tsx
import { Suspense } from 'react';
import SearchParamsHandler from './SearchParamsHandler';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900 px-6">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SearchParamsHandler />
      </Suspense>
    </div>
  );
}