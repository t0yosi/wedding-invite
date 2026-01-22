'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Guest } from '@/lib/db';
import RSVPForm from '@/components/RSVPForm';
import EventSchedule from '@/components/EventSchedule';
import PhotoGallery from '@/components/PhotoGallery';

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGuest = async () => {
    try {
      const response = await fetch(`/api/guests/${token}`);
      if (!response.ok) {
        throw new Error('Guest not found');
      }
      const data = await response.json();
      setGuest(data.guest);
    } catch (err) {
      setError('Invalid invitation link');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGuest();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-serif mb-2">Invalid Invitation</h2>
          <p className="text-gray-600">{error || 'This invitation link is not valid.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-primary text-6xl mb-4">💍</div>
          <p className="text-lg text-gray-600 tracking-widest">TLC2026</p>
          <h1 className="text-4xl md:text-5xl font-serif text-primary">
            Chiamaka Lilian
          </h1>
          <p className="text-xl text-gray-600">&</p>
          <h1 className="text-4xl md:text-5xl font-serif text-primary">
            Tosin Richard
          </h1>
          <p className="text-xl text-gray-600 mt-4">Warmly invite you to their wedding</p>
          <div className="text-lg space-y-2 pt-4">
            <p className="font-semibold text-xl">Saturday, April 18th, 2026</p>
            <div className="pt-2">
              <p className="font-medium">Holy Mass @ 10:00 AM</p>
              <p className="text-gray-600">Christ the King Catholic Church</p>
              <p className="text-gray-600">GRA, Enugu</p>
            </div>
            <div className="pt-4">
              <p className="font-medium">Reception to follow</p>
              <p className="text-gray-600">Hotel Sylvia</p>
              <p className="text-gray-600">Nza Street, Independence Layout, Enugu</p>
            </div>
          </div>
        </div>

        {/* Personalized greeting */}
        <div className="card text-center">
          <p className="text-2xl font-serif mb-2">Dear {guest.name},</p>
          <p className="text-gray-700 leading-relaxed">
            We are delighted to invite you to celebrate our special day with us.
            Your presence would mean the world to us as we begin this new chapter together.
          </p>
          {guest.rsvp_status === 'attending' && guest.access_code && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-700 mb-2">Your Check-in Access Code:</p>
              <p className="text-3xl font-mono font-bold text-green-800 tracking-wider">{guest.access_code}</p>
              <p className="text-xs text-green-600 mt-2">Please present this code at the venue for check-in</p>
            </div>
          )}
        </div>

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Event Schedule */}
        <EventSchedule />

        {/* RSVP Form */}
        <RSVPForm guest={guest} onSuccess={fetchGuest} />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>We look forward to celebrating with you!</p>
          <p className="text-primary font-medium">#TLC2026</p>
        </div>
      </div>
    </div>
  );
}
