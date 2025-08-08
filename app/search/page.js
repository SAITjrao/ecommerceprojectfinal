// app/search/SearchPage.js
"use client";
import { Suspense } from 'react';
import SearchResults from './Results';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}