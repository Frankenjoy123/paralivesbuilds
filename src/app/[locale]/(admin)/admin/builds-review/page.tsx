'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface PendingBuild {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string;
  status: string;
  lotSize: string | null;
  floors: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  budget: number | null;
  createdAt: string;
  updatedAt: string;
  styleName: string | null;
  creatorName: string | null;
}

export default function BuildsReviewPage() {
  const t = useTranslations('admin');
  const [builds, setBuilds] = useState<PendingBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/builds/pending');
      const data = await res.json();
      if (data.data?.builds) {
        setBuilds(data.data.builds);
      } else {
        setError(data.message || 'Failed to load');
      }
    } catch {
      setError('Failed to load pending builds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (buildId: string) => {
    setActionLoading(buildId);
    try {
      const res = await fetch('/api/builds/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId }),
      });
      const data = await res.json();
      if (data.data) {
        setBuilds((prev) => prev.filter((b) => b.id !== buildId));
      } else {
        setError(data.message || 'Approve failed');
      }
    } catch {
      setError('Approve failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (buildId: string) => {
    if (!confirm('Are you sure you want to reject this build?')) return;
    setActionLoading(buildId);
    try {
      const res = await fetch('/api/builds/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId }),
      });
      const data = await res.json();
      if (data.data) {
        setBuilds((prev) => prev.filter((b) => b.id !== buildId));
      } else {
        setError(data.message || 'Reject failed');
      }
    } catch {
      setError('Reject failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getImages = (imagesJson: string) => {
    try {
      return JSON.parse(imagesJson) as string[];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#e07a5f]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Builds Review
          </h1>
          <p className="text-[#6b6b6b] text-sm mt-1">
            {builds.length} pending {builds.length === 1 ? 'build' : 'builds'} awaiting review
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {builds.length === 0 ? (
        <div className="text-center py-16 bg-[#faf9f7] rounded-2xl border border-[#e8e6e3]">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">
            All Caught Up!
          </h3>
          <p className="text-[#6b6b6b]">
            No builds pending review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {builds.map((b) => {
            const imgs = getImages(b.images);
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-[#e8e6e3] overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    {imgs[0] && (
                      <div className="relative w-48 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-[#f0eeeb]">
                        <Image
                          src={imgs[0].startsWith('http') ? imgs[0] : `/api/images/${imgs[0]}`}
                          alt={b.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#1a1a1a]">
                            {b.title}
                          </h3>
                          <p className="text-sm text-[#9a9a9a] mt-0.5">
                            by {b.creatorName || 'Unknown'} · {b.styleName || 'Unknown Style'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleApprove(b.id)}
                            disabled={actionLoading === b.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === b.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            disabled={actionLoading === b.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-[#6b6b6b] mt-3 line-clamp-2">
                        {b.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {b.lotSize && (
                          <span className="px-2.5 py-1 bg-[#faf9f7] border border-[#e8e6e3] rounded-full text-xs text-[#6b6b6b]">
                            {b.lotSize}
                          </span>
                        )}
                        {b.floors !== null && (
                          <span className="px-2.5 py-1 bg-[#faf9f7] border border-[#e8e6e3] rounded-full text-xs text-[#6b6b6b]">
                            {b.floors} {b.floors === 1 ? 'Floor' : 'Floors'}
                          </span>
                        )}
                        {b.bedrooms !== null && (
                          <span className="px-2.5 py-1 bg-[#faf9f7] border border-[#e8e6e3] rounded-full text-xs text-[#6b6b6b]">
                            {b.bedrooms} {b.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                          </span>
                        )}
                        {b.bathrooms !== null && (
                          <span className="px-2.5 py-1 bg-[#faf9f7] border border-[#e8e6e3] rounded-full text-xs text-[#6b6b6b]">
                            {b.bathrooms} {b.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                          </span>
                        )}
                        {b.budget !== null && (
                          <span className="px-2.5 py-1 bg-[#faf9f7] border border-[#e8e6e3] rounded-full text-xs text-[#6b6b6b]">
                            §{b.budget.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {imgs.length > 1 && (
                        <div className="flex gap-2 mt-3">
                          {imgs.slice(1, 4).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#f0eeeb]"
                            >
                              <Image
                                src={img.startsWith('http') ? img : `/api/images/${img}`}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {imgs.length > 4 && (
                            <div className="w-16 h-12 rounded-lg bg-[#f0eeeb] flex items-center justify-center text-xs text-[#9a9a9a]">
                              +{imgs.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
