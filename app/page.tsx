import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Main Content */}
        <div className="space-y-6">
          <div className="text-primary text-8xl mb-8 animate-pulse">💍</div>
          <h1 className="text-6xl md:text-7xl font-serif text-primary mb-4">
            Sarah & Michael
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-light">
            are getting married
          </p>
          <div className="text-xl text-gray-600 space-y-2 pt-4">
            <p className="font-medium">Saturday, June 15, 2024</p>
            <p>The Grand Ballroom, New York</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="card max-w-2xl mx-auto space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            If you have received a personalized invitation link, please use it to RSVP.
            Otherwise, please contact us for your unique invitation.
          </p>

          <div className="pt-4">
            <Link href="/admin" className="btn-secondary inline-block">
              Admin Access
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 space-y-2 pt-8">
          <p>For questions or assistance, please contact:</p>
          <p>
            <a href="mailto:wedding@example.com" className="text-primary hover:underline">
              wedding@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
