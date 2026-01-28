import { useState } from 'react';
import { soundManager } from './soundManager';

function MuteButton() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <button
      onClick={toggleMute}
      className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );
}

export default MuteButton;
