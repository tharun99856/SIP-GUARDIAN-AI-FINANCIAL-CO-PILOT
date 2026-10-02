export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Checkpoint by SIP Guardian
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart intervention system helping investors understand the consequences 
            of SIP changes and make informed decisions
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Clear Impact</h3>
              <p className="text-sm text-gray-600">
                See how your changes affect your financial goals
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI Explanations</h3>
              <p className="text-sm text-gray-600">
                Simple language explanations of verified calculations
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Smart Alternatives</h3>
              <p className="text-sm text-gray-600">
                Explore options without pressure or bias
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/checkpoint"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Demo Checkpoint
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>MVP Phase 1: SIP Pause/Reduce/Cancel Intervention</p>
          <p className="mt-2">Shadow Mode Testing • No Live Deployment Yet</p>
        </div>
      </div>
    </main>
  );
}
