'use client';

export default function EventSchedule() {
  const events = [
    {
      time: '3:00 PM',
      title: 'Guest Arrival',
      description: 'Welcome drinks and light refreshments',
    },
    {
      time: '4:00 PM',
      title: 'Ceremony Begins',
      description: 'Main wedding ceremony',
    },
    {
      time: '5:30 PM',
      title: 'Cocktail Hour',
      description: 'Mingle and enjoy appetizers',
    },
    {
      time: '6:30 PM',
      title: 'Reception',
      description: 'Dinner, toasts, and dancing',
    },
    {
      time: '10:00 PM',
      title: 'Send-off',
      description: 'Sparkler exit',
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
