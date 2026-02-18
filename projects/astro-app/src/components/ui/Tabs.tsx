import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b-2 border-cosmic-blue mb-8">
      <div className="flex gap-2 overflow-x-auto justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-6 py-4 font-medium transition-all whitespace-nowrap rounded-t-lg ${
              activeTab === tab.id
                ? 'text-celestial-gold bg-cosmic-blue border-b-2 border-mystic-light -mb-0.5'
                : 'text-moon-silver hover:text-mystic-light hover:bg-cosmic-deep'
            }`}
          >
            {tab.icon && <span className="mr-2 text-lg">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TabPanelProps {
  children: ReactNode;
  value: string;
  activeValue: string;
}

export function TabPanel({ children, value, activeValue }: TabPanelProps) {
  if (value !== activeValue) return null;
  return <div className="animate-fade-in">{children}</div>;
}
