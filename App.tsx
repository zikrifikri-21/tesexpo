import React, { useState } from 'react';
import ImageEditor from './components/ImageEditor';
import ImageGenerator from './components/ImageGenerator';
import { TabButton } from './components/common/Button';
import { SparklesIcon, PhotoIcon, SettingsIcon } from './components/common/Icons';
import ModelSettings from './components/ModelSettings';

type Tab = 'editor' | 'generator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-rose-100 font-mono text-gray-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Gemini Image Studio</h1>
          <p className="text-lg text-gray-700">Edit Photos & Generate Art with AI</p>
           <button 
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-0 right-0 p-2 border-2 border-black bg-white shadow-neo-sm hover:shadow-none transform hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            aria-label="Model Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="bg-white border-2 border-black shadow-neo p-4 sm:p-6">
          <nav className="flex border-b-2 border-black mb-6">
            <TabButton
              onClick={() => setActiveTab('editor')}
              isActive={activeTab === 'editor'}
            >
              <PhotoIcon className="w-5 h-5 mr-2" />
              Image Editor
            </TabButton>
            <TabButton
              onClick={() => setActiveTab('generator')}
              isActive={activeTab === 'generator'}
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Image Generator
            </TabButton>
          </nav>

          <main>
            {activeTab === 'editor' && <ImageEditor />}
            {activeTab === 'generator' && <ImageGenerator />}
          </main>
        </div>
        <footer className="text-center mt-8 text-gray-600">
            <p>Powered by Gemini, Imagen 4 & Hugging Face Transformers</p>
        </footer>
      </div>
      {isSettingsOpen && <ModelSettings onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default App;