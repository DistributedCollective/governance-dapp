import React from 'react';

export function PageSkeleton() {
  return (
    <div className="container py-8">
      <div className="skeleton my-3 w-2/5">Loading...</div>
      <div className="flex space-x-4 my-3">
        <div className="skeleton w-1/3">Loading...</div>
        <div className="skeleton w-1/3">Loading...</div>
        <div className="skeleton w-1/3">Loading...</div>
      </div>
      <div className="skeleton my-3">Loading...</div>
      <div className="skeleton my-3 w-2/3">Loading...</div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex space-x-4">
      <div className="skeleton w-1/3">Loading...</div>
      <div className="skeleton w-1/3">Loading...</div>
      <div className="skeleton w-1/3">Loading...</div>
    </div>
  );
}
