import React, { useState } from 'react';
import SubkonSelector from './components/SubkonSelector';
import OrderInterface from './components/OrderInterface';
import { Subkon } from './types';

const App: React.FC = () => {
  const [selectedSubkon, setSelectedSubkon] = useState<Subkon | null>(null);

  return (
    <div className="antialiased text-gray-900 bg-gray-50 min-h-screen">
      {!selectedSubkon ? (
        <SubkonSelector onSelect={setSelectedSubkon} />
      ) : (
        <OrderInterface 
          subkon={selectedSubkon} 
          onBack={() => setSelectedSubkon(null)} 
        />
      )}
    </div>
  );
};

export default App;