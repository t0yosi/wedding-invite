'use client';

export default function EventSchedule() {
  const events = [
    {
      time: '9:30 AM',
      title: 'Guest Arrival',
      description: 'Arrive at Christ the King Catholic Church, GRA, Enugu',
    },
    {
      time: '10:00 AM',
      title: 'Holy Mass',
      description: 'Wedding Mass and Exchange of Vows',
    },
    {
      time: '12:00 PM',
      title: 'Photo Session',
      description: 'Family and friends photos at the church',
    },
    {
      time: '1:00 PM',
      title: 'Reception',
      description: 'Celebration at Hotel Sylvia, Independence Layout',
    },
    {
      time: '6:00 PM',
      title: 'After Party',
      description: 'Dance, celebrate, and make memories!',
    },
  ];

  return (
    <div className="card">
      <h2 className="text-3xl font-serif text-center mb-8">Event Schedule</h2>
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="flex gap-6 pb-6 border-b-2 border-gray-100 last:border-0 last:pb-0">
            <div className="flex-shrink-0 w-24">
              <span className="text-primary font-semibold text-lg">{event.time}</span>
            </div>
            <div className="flex-grow">
              <h3 className="font-serif text-xl mb-1">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
