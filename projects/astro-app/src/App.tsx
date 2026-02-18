import { useState, useEffect, lazy, Suspense } from 'react';
import { Tabs, TabPanel } from './components/ui/Tabs';
import { PlanetsList } from './components/chart/PlanetsList';
import { HousesList } from './components/chart/HousesList';
import { AspectsList } from './components/chart/AspectsList';
import { birthChart } from './data/birthChart';
import { storage } from './services/storage';

const ChatInterface = lazy(() =>
  import('./components/chat/ChatInterface').then((module) => ({
    default: module.ChatInterface
  }))
);

function App() {
  const [activeTab, setActiveTab] = useState('planets');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  useEffect(() => {
    const saved = storage.loadApiKey();
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      storage.saveApiKey(tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowApiKeyModal(false);
      setTempApiKey('');
    }
  };

  const tabs = [
    { id: 'planets', label: 'Planètes', icon: '☉' },
    { id: 'houses', label: 'Maisons', icon: '⌂' },
    { id: 'aspects', label: 'Aspects', icon: '✧' },
    { id: 'chat', label: 'Assistant IA', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-cosmic-dark text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-celestial-gold mb-4">
            Thème Astral Interactive
          </h1>
          <p className="text-lg text-moon-silver mb-2">
            Ascendant {birthChart.ascendant} • Descendant {birthChart.descendant}
          </p>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="mt-6 text-sm text-mystic-light hover:text-mystic-purple transition-colors px-4 py-2 rounded-lg hover:bg-cosmic-blue"
          >
            ⚙️ Configurer la clé API
          </button>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <TabPanel value="planets" activeValue={activeTab}>
          <PlanetsList planets={birthChart.planets} />
        </TabPanel>

        <TabPanel value="houses" activeValue={activeTab}>
          <HousesList houses={birthChart.houses} />
        </TabPanel>

        <TabPanel value="aspects" activeValue={activeTab}>
          <AspectsList aspects={birthChart.aspects} />
        </TabPanel>

        <TabPanel value="chat" activeValue={activeTab}>
          <div className="max-w-4xl mx-auto">
            {apiKey ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-[70vh]">
                    <div className="text-mystic-light text-lg">Chargement...</div>
                  </div>
                }
              >
                <ChatInterface apiKey={apiKey} />
              </Suspense>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
                <p className="text-gray-400 text-lg text-center max-w-md">
                  Veuillez configurer votre clé API Claude pour utiliser l'assistant
                </p>
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="px-8 py-4 bg-mystic-purple hover:bg-mystic-light rounded-lg transition-colors font-medium"
                >
                  Configurer la clé API
                </button>
              </div>
            )}
          </div>
        </TabPanel>
      </div>

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-cosmic-deep rounded-xl p-8 max-w-md w-full border-2 border-cosmic-blue shadow-2xl">
            <h2 className="text-2xl font-bold text-celestial-gold mb-4">
              Configuration de la clé API
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Entrez votre clé API Claude (Anthropic) pour activer l'assistant IA.
            </p>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-cosmic-blue text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-mystic-purple transition-all"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 px-4 py-3 bg-mystic-purple hover:bg-mystic-light rounded-lg transition-colors font-medium"
              >
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setTempApiKey('');
                }}
                className="flex-1 px-4 py-3 bg-cosmic-blue hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
