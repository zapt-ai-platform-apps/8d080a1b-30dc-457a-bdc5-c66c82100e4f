import { createSignal, onMount, createEffect, Show, For } from 'solid-js';
import { supabase, createEvent } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [criteria, setCriteria] = createSignal({
    minPrice: '',
    maxPrice: '',
    location: '',
    growthTarget: '',
    industry: '',
  });
  const [companies, setCompanies] = createSignal([]);

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCriteria({ ...criteria(), [name]: value });
  };

  const findTargetCompanies = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prompt = `
        Based on the following investment criteria, identify the top 3 real companies that match these criteria for potential acquisition. Please ensure the companies are real and currently active.

        Please return the response in the following JSON format:
        {
          "companies": [
            {
              "name": "Company Name",
              "purchasePrice": "Purchase Price",
              "location": "Location",
              "expectedGrowth": "Expected Growth Percentage",
              "industry": "Industry"
            },
            ...
          ]
        }

        Investment Criteria:
        - Minimum Purchase Price: ${criteria().minPrice}
        - Maximum Purchase Price: ${criteria().maxPrice}
        - Location: ${criteria().location}
        - Growth Target Percentage: ${criteria().growthTarget}
        - Industry: ${criteria().industry}
      `;

      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'json',
      });

      if (result && result.companies) {
        setCompanies(result.companies);
      } else {
        console.error('Invalid response from AI:', result);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">
                Sign in with ZAPT
              </h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">
              Private Equity Target Finder
            </h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <form onSubmit={findTargetCompanies} class="space-y-4 mb-8">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">
              Investment Criteria
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold">
                  Minimum Purchase Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={criteria().minPrice}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">
                  Maximum Purchase Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={criteria().maxPrice}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={criteria().location}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">
                  Growth Target Percentage
                </label>
                <input
                  type="number"
                  name="growthTarget"
                  value={criteria().growthTarget}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div class="md:col-span-2">
                <label class="block mb-1 font-semibold">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={criteria().industry}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                loading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading()}
            >
              <Show when={loading()}>Finding Companies...</Show>
              <Show when={!loading()}>Find Target Companies</Show>
            </button>
          </form>

          <Show when={companies().length > 0}>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">
              Top Target Companies
            </h2>
            <div class="space-y-4">
              <For each={companies()}>
                {(company) => (
                  <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <p class="font-semibold text-lg text-purple-600 mb-2">
                      {company.name}
                    </p>
                    <p>
                      <span class="font-semibold">Purchase Price:</span>{' '}
                      {company.purchasePrice}
                    </p>
                    <p>
                      <span class="font-semibold">Location:</span>{' '}
                      {company.location}
                    </p>
                    <p>
                      <span class="font-semibold">Expected Growth:</span>{' '}
                      {company.expectedGrowth}
                    </p>
                    <p>
                      <span class="font-semibold">Industry:</span>{' '}
                      {company.industry}
                    </p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;