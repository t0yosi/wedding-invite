'use client';

import { Guest } from '@/lib/db';

interface AdminGuestListProps {
  guests: Guest[];
  onDelete?: (id: number) => void;
}

export default function AdminGuestList({ guests, onDelete }: AdminGuestListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plus One
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Access Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check-in
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {guests.map((guest) => (
            <tr key={guest.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                {guest.plus_one_attending && guest.plus_one_name && (
                  <div className="text-xs text-gray-500">+ {guest.plus_one_name}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{guest.email}</div>
                {guest.phone && (
                  <div className="text-xs text-gray-500">{guest.phone}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    guest.rsvp_status
                  )}`}
                >
                  {getStatusText(guest.rsvp_status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {guest.plus_one_allowed ? (
                  guest.plus_one_attending ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-gray-400">Allowed</span>
                  )
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {guest.meal_preference || '-'}
                </div>
                {guest.plus_one_attending && guest.plus_one_meal_preference && (
                  <div className="text-xs text-gray-500">
                    + {guest.plus_one_meal_preference}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {guest.access_code ? (
                  <span className="font-mono text-sm font-bold tracking-wider text-purple-700 bg-purple-100 px-2 py-1 rounded">
                    {guest.access_code}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {guest.checked_in ? (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Checked In
                  </span>
                ) : guest.rsvp_status === 'attending' ? (
                  <span className="text-gray-400 text-sm">Not yet</span>
                ) : (
                  <span className="text-gray-300 text-sm">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  onClick={() => {
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
                    copyToClipboard(`${baseUrl}/invite/${guest.token}`);
                  }}
                  className="text-primary hover:text-opacity-80"
                >
                  Copy Link
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
