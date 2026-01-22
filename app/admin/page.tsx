'use client';

import { useEffect, useState } from 'react';
import { Guest } from '@/lib/db';
import AdminGuestList from '@/components/AdminGuestList';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    plus_one_allowed: false,
  });

  const [checkInCode, setCheckInCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string; guest?: Guest } | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      setIsAuthenticated(true);
      fetchGuests();
      fetchStats();
    }
  };

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/guests', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setGuests(data.guests);
    } catch (err) {
      setError('Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(newGuest),
      });

      if (!response.ok) {
        throw new Error('Failed to create guest');
      }

      const data = await response.json();
      alert(`Guest added! Invitation link:\n${data.inviteUrl}`);

      setNewGuest({
        name: '',
        email: '',
        phone: '',
        plus_one_allowed: false,
      });

      fetchGuests();
      fetchStats();
    } catch (err) {
      setError('Failed to add guest');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInLoading(true);
    setCheckInResult(null);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ access_code: checkInCode.toUpperCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckInResult({ success: false, message: data.error || 'Check-in failed' });
      } else {
        setCheckInResult({ success: true, message: data.message, guest: data.guest });
        setCheckInCode('');
        fetchGuests();
        fetchStats();
      }
    } catch (err) {
      setCheckInResult({ success: false, message: 'Check-in failed. Please try again.' });
    } finally {
      setCheckInLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card max-w-md w-full">
          <h1 className="text-3xl font-serif text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-serif">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.total_guests}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Guests</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.attending}
              </div>
              <div className="text-sm text-gray-600 mt-1">Attending</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-600">
                {stats.declined}
              </div>
              <div className="text-sm text-gray-600 mt-1">Declined</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.plus_ones}
              </div>
              <div className="text-sm text-gray-600 mt-1">Plus Ones</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.checked_in || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Checked In</div>
            </div>
          </div>
        )}

        {/* Check-in Section */}
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-2xl font-serif mb-4">Guest Check-in</h2>
          <form onSubmit={handleCheckIn} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit access code"
                className="input-field text-2xl text-center tracking-widest font-mono uppercase"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-8"
              disabled={checkInLoading || checkInCode.length !== 6}
            >
              {checkInLoading ? 'Checking...' : 'Check In'}
            </button>
          </form>
          {checkInResult && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                checkInResult.success
                  ? 'bg-green-100 border-2 border-green-300 text-green-800'
                  : 'bg-red-100 border-2 border-red-300 text-red-800'
              }`}
            >
              <p className="font-medium text-lg">{checkInResult.message}</p>
              {checkInResult.guest && (
                <p className="text-sm mt-1">
                  {checkInResult.guest.plus_one_attending
                    ? `With plus one: ${checkInResult.guest.plus_one_name}`
                    : 'No plus one'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Add Guest Form */}
        <div className="card">
          <h2 className="text-2xl font-serif mb-4">Add New Guest</h2>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAddGuest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={newGuest.plus_one_allowed}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, plus_one_allowed: e.target.checked })
                  }
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm font-medium">Allow Plus One</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Guest'}
              </button>
            </div>
          </form>
        </div>

        {/* Guest List */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif">Guest List</h2>
            <button onClick={fetchGuests} className="btn-secondary text-sm py-2">
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            </div>
          ) : (
            <AdminGuestList guests={guests} />
          )}
        </div>
      </div>
    </div>
  );
}
