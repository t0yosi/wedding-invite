'use client';

import { useState } from 'react';
import { Guest } from '@/lib/db';

interface RSVPFormProps {
  guest: Guest;
  onSuccess: () => void;
}

export default function RSVPForm({ guest, onSuccess }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    rsvp_status: guest.rsvp_status === 'pending' ? '' : guest.rsvp_status,
    meal_preference: guest.meal_preference || '',
    plus_one_name: guest.plus_one_name || '',
    plus_one_attending: guest.plus_one_attending || false,
    plus_one_meal_preference: guest.plus_one_meal_preference || '',
    message: guest.message || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.rsvp_status) {
      setError('Please select whether you will attend');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/guests/${guest.token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rsvp_status: formData.rsvp_status,
          meal_preference: formData.meal_preference,
          plus_one_name: formData.plus_one_attending ? formData.plus_one_name : null,
          plus_one_attending: formData.plus_one_attending,
          plus_one_meal_preference: formData.plus_one_attending ? formData.plus_one_meal_preference : null,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-serif mb-2">Thank You!</h3>
        <p className="text-gray-600">Your RSVP has been received.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <h2 className="text-3xl font-serif text-center mb-6">RSVP</h2>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-3">
          Will you be attending?
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="rsvp_status"
              value="attending"
              checked={formData.rsvp_status === 'attending'}
              onChange={(e) =>
                setFormData({ ...formData, rsvp_status: e.target.value as 'attending' | 'declined' })
              }
              className="w-4 h-4 text-primary"
            />
            <span>Yes, I will attend</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="rsvp_status"
              value="declined"
              checked={formData.rsvp_status === 'declined'}
              onChange={(e) =>
                setFormData({ ...formData, rsvp_status: e.target.value as 'attending' | 'declined' })
              }
              className="w-4 h-4 text-primary"
            />
            <span>Unfortunately, I cannot attend</span>
          </label>
        </div>
      </div>

      {formData.rsvp_status === 'attending' && (
        <>
          <div>
            <label htmlFor="meal_preference" className="block text-sm font-medium mb-2">
              Meal Preference
            </label>
            <select
              id="meal_preference"
              value={formData.meal_preference}
              onChange={(e) =>
                setFormData({ ...formData, meal_preference: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="">Select a meal</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>

          {guest.plus_one_allowed && (
            <>
              <div className="border-t-2 border-gray-100 pt-6">
                <label className="flex items-center space-x-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.plus_one_attending}
                    onChange={(e) =>
                      setFormData({ ...formData, plus_one_attending: e.target.checked })
                    }
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="font-medium">I will bring a plus one</span>
                </label>
              </div>

              {formData.plus_one_attending && (
                <>
                  <div>
                    <label htmlFor="plus_one_name" className="block text-sm font-medium mb-2">
                      Plus One Name
                    </label>
                    <input
                      type="text"
                      id="plus_one_name"
                      value={formData.plus_one_name}
                      onChange={(e) =>
                        setFormData({ ...formData, plus_one_name: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="plus_one_meal" className="block text-sm font-medium mb-2">
                      Plus One Meal Preference
                    </label>
                    <select
                      id="plus_one_meal"
                      value={formData.plus_one_meal_preference}
                      onChange={(e) =>
                        setFormData({ ...formData, plus_one_meal_preference: e.target.value })
                      }
                      className="input-field"
                      required
                    >
                      <option value="">Select a meal</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten-free">Gluten-Free</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Special Message (Optional)
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="input-field resize-none"
          placeholder="Share your wishes or any special requirements..."
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit RSVP'}
      </button>
    </form>
  );
}
