// Sound Manager for Motion-Map
// Place your audio files in: /public/sounds/

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = localStorage.getItem('motionmap-muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('motionmap-volume')) || 0.3;
  }

  // Preload sounds for better performance
  preload(soundMap) {
    Object.entries(soundMap).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.sounds[key] = audio;
    });
  }

  play(soundKey) {
    if (this.isMuted) return;
    
    const sound = this.sounds[soundKey];
    if (sound) {
      // Clone the audio to allow overlapping plays
      const audioClone = sound.cloneNode();
      audioClone.volume = this.volume;
      audioClone.play().catch(err => {
        // Silently fail if autoplay is blocked
        console.debug('Sound play blocked:', err);
      });
    }
  }

  playLoop(soundKey) {
    if (this.isMuted) return;
    
    const sound = this.sounds[soundKey];
    if (sound) {
      sound.loop = true;
      sound.volume = this.volume * 0.5; // Quieter for ambient
      sound.play().catch(err => {
        console.debug('Ambient sound blocked:', err);
      });
    }
  }

  stopLoop(soundKey) {
    const sound = this.sounds[soundKey];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('motionmap-volume', this.volume.toString());
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('motionmap-muted', this.isMuted.toString());
    
    if (this.isMuted) {
      Object.values(this.sounds).forEach(sound => sound.pause());
    }
    
    return this.isMuted;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Initialize sounds - call this in your App component
export const initSounds = () => {
  soundManager.preload({
    // Ambient
    'ambient': '/sounds/ambient-loop.mp3',
    
    // UI Interactions
    'hover': '/sounds/hover.mp3',
    'click': '/sounds/click.mp3',
    'drilldown': '/sounds/drilldown.mp3',
    'back': '/sounds/back.mp3',
    
    // Transitions
    'transition': '/sounds/transition.mp3',
    
    // Form
    'formSubmit': '/sounds/form-submit.mp3',
    'formError': '/sounds/form-error.mp3'
  });
};
