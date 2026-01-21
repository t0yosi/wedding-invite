'use client';

import Image from 'next/image';

export default function PhotoGallery() {
  // Placeholder photos - replace with actual photo paths
  const photos = [
    { src: '/photos/photo1.jpg', alt: 'Photo 1' },
    { src: '/photos/photo2.jpg', alt: 'Photo 2' },
    { src: '/photos/photo3.jpg', alt: 'Photo 3' },
    { src: '/photos/photo4.jpg', alt: 'Photo 4' },
  ];

  return (
    <div className="card">
      <h2 className="text-3xl font-serif text-center mb-8">Our Story</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 group cursor-pointer"
          >
            {/* Placeholder - will show actual images when uploaded */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            {/* Uncomment when you have actual photos */}
            {/* <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            /> */}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">
        Upload your photos to /public/photos/ folder
      </p>
    </div>
  );
}
