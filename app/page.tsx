import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Main Content */}
        <div className="space-y-6">
          <div className="text-primary text-8xl mb-8 animate-pulse">💍</div>
          <p className="text-xl text-gray-600 tracking-widest">TLC2026</p>
          <h1 className="text-5xl md:text-7xl font-serif text-primary mb-4">
            Chiamaka Lilian
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-light">
            &
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-primary mb-4">
            Tosin Richard
          </h1>
          <div className="text-xl text-gray-600 space-y-2 pt-4">
            <p className="font-medium">Saturday, April 18th, 2026</p>
            <p>Christ the King Catholic Church, GRA, Enugu</p>
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
          <p>We look forward to celebrating with you!</p>
        </div>
      </div>
    </div>
  );
}
