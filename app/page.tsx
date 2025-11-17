import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
          Welcome to HealthyBite
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Personalized meal plans tailored to your health goals. Convenient, nutritious, and delivered to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Personalized Plans</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Custom meal recommendations based on your unique health profile and goals.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">🥗</div>
          <h3 className="text-xl font-bold mb-2">Nutritious Meals</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Fresh, balanced meals designed by nutrition experts for optimal health.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">Convenient Delivery</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Hassle-free subscription plans with delivery right to your doorstep.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto">
              1
            </div>
            <h4 className="font-semibold">Sign Up</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Create your free account
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto">
              2
            </div>
            <h4 className="font-semibold">Complete Profile</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Answer health questionnaire
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto">
              3
            </div>
            <h4 className="font-semibold">Get Recommendations</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Receive personalized meal plans
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto">
              4
            </div>
            <h4 className="font-semibold">Subscribe & Enjoy</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose a plan and start eating healthy
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
