'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface Style {
  id: string;
  name: string;
}

export default function SubmitBuildPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [styles, setStyles] = useState<Style[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [styleId, setStyleId] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [floors, setFloors] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [budget, setBudget] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/styles')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setStyles(d.data);
      });
  }, []);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('files', file);
    }

    try {
      const res = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.data?.urls) {
        setImages((prev) => [...prev, ...data.data.urls]);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !styleId || images.length === 0) {
      setError('Please fill in all required fields and upload at least one image');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/builds/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          styleId,
          lotSize,
          floors: floors ? Number(floors) : undefined,
          bedrooms: bedrooms ? Number(bedrooms) : undefined,
          bathrooms: bathrooms ? Number(bathrooms) : undefined,
          budget: budget ? Number(budget) : undefined,
          images,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setSuccess(data.data.message || 'Submitted successfully!');
        setTimeout(() => router.push('/builds'), 2000);
      } else {
        setError(data.message || 'Submit failed');
      }
    } catch {
      setError('Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
          Submit Your Build
        </h1>
        <p className="text-[#6b6b6b]">
          Share your amazing Paralives creation with the community.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            Build Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Cozy Cottage Starter Home"
            className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your build, features, inspiration..."
            rows={5}
            className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors resize-none"
            required
          />
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            Style <span className="text-red-500">*</span>
          </label>
          <select
            value={styleId}
            onChange={(e) => setStyleId(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors appearance-none"
            required
          >
            <option value="">Select a style</option>
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Lot Size</label>
            <input
              type="text"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              placeholder="20×15"
              className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Floors</label>
            <input
              type="number"
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
              placeholder="1"
              min={1}
              className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Bedrooms</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              placeholder="2"
              min={0}
              className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Bathrooms</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="1"
              min={0}
              className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Budget (§)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="25000"
            min={0}
            className="w-full px-4 py-3 bg-white border border-[#e8e6e3] rounded-xl text-sm outline-none focus:border-[#e07a5f] transition-colors"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            Images <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#e8e6e3]">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-24 h-24 rounded-lg border-2 border-dashed border-[#e8e6e3] flex flex-col items-center justify-center gap-1 text-[#9a9a9a] hover:border-[#e07a5f] hover:text-[#e07a5f] transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs">Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full md:w-auto px-8 py-3.5 bg-[#e07a5f] text-white font-semibold rounded-xl hover:bg-[#c96a52] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Build'}
          </button>
        </div>
      </form>
    </div>
  );
}
