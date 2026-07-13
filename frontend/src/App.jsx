import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import MoodPage from './pages/MoodPage';
import './styles/globals.css';
import './styles/variables.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/hero.css';
import './styles/mood.css';
import './styles/room.css';
import './styles/animations.css';

function App() {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleBack = () => {
    setSelectedMood(null);
  };

  const handleRoomSelect = (destination) => {
    // Backend will later decide what happens here
    console.log('Destination selected:', destination.id);
  };

  const handleSomethingElse = () => {
    console.log('Something else selected');
  };

  if (selectedMood) {
    return (
      <MoodPage
        mood={selectedMood}
        onBack={handleBack}
        onSelectRoom={handleRoomSelect}
        onSelectSomethingElse={handleSomethingElse}
      />
    );
  }

  return <HomePage onMoodSelect={handleMoodSelect} />;
}

export default App;