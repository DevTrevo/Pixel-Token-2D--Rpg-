import React from 'react';
import { GameMap } from './components/GameMap';
import { PlayerStats } from './components/PlayerStats';
import { Controls } from './components/Controls';
import { CombatLog } from './components/CombatLog';
import { SkillBar } from './components/SkillBar';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex gap-8">
        <div className="space-y-4">
          <PlayerStats />
          <Controls />
          <SkillBar />
          <CombatLog />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <GameMap />
        </div>
      </div>
    </div>
  );
}

export default App;