import React, { useState } from 'react';
import DemoTab from './components/DemoTab';
import ExplanationTab from './components/ExplanationTab';
import SecurityTab from './components/SecurityTab';

function App() {
  const [activeTab, setActiveTab] = useState('demo');

  const tabs = [
    { id: 'demo', label: 'Demo Thực hành' },
    { id: 'explanation', label: 'Giải thích' },
    { id: 'security', label: 'Bảo mật Nâng cao' },
  ];

  return (
    <div className="container">
      <h1>Demo Mã hóa RSA</h1>

      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className={`tab-content ${activeTab === 'demo' ? 'active' : ''}`}>
        {activeTab === 'demo' && <DemoTab />}
      </div>

      <div
        className={`tab-content ${activeTab === 'explanation' ? 'active' : ''}`}
      >
        {activeTab === 'explanation' && <ExplanationTab />}
      </div>

      <div
        className={`tab-content ${activeTab === 'security' ? 'active' : ''}`}
      >
        {activeTab === 'security' && <SecurityTab />}
      </div>

      <div className="footer">
        <p>Demo Mã hóa RSA</p>
      </div>
    </div>
  );
}

export default App;
