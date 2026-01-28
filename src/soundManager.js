// Minimal Sound Manager for Motion-Map
// Safe for server-side rendering

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.volume = 0.3;
    this.isClient = typeof window !== 'undefined';
    
    // Only try to load from localStorage in browser
    if (this.isClient && window.localStorage) {
      try {
        this.isMuted = localStorage.getItem('motionmap-muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('motionmap-volume')) || 0.3;
      } catch (e) {
        // Ignore errors
      }
    }
  }

  preload(soundMap) {
    if (!this.isClient) return;
    
    Object.entries(soundMap).forEach(([key, path]) => {
      try {
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.preload = 'auto';
        this.sounds[key] = audio;
      } catch (e) {
        console.debug('Failed to load sound:', key);
      }
    });
  }

  play(soundKey) {
    if (!this.isClient || this.isMuted) return;
    
    const sound = this.sounds[soundKey];
    if (sound) {
      try {
        const audioClone = sound.cloneNode();
        audioClone.volume = this.volume;
        audioClone.play().catch(() => {});
      } catch (e) {
        // Ignore
      }
    }
  }

  playLoop(soundKey) {
    if (!this.isClient || this.isMuted) return;
    
    const sound = this.sounds[soundKey];
    if (sound) {
      try {
        sound.loop = true;
        sound.volume = this.volume * 0.5;
        sound.play().catch(() => {});
      } catch (e) {
        // Ignore
      }
    }
  }

  stopLoop(soundKey) {
    if (!this.isClient) return;
    
    const sound = this.sounds[soundKey];
    if (sound) {
      try {
        sound.pause();
        sound.currentTime = 0;
      } catch (e) {
        // Ignore
      }
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    
    if (this.isClient && window.localStorage) {
      try {
        localStorage.setItem('motionmap-volume', this.volume.toString());
      } catch (e) {
        // Ignore
      }
    }
    
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.volume = this.volume;
      } catch (e) {
        // Ignore
      }
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isClient && window.localStorage) {
      try {
        localStorage.setItem('motionmap-muted', this.isMuted.toString());
      } catch (e) {
        // Ignore
      }
    }
    
    if (this.isMuted) {
      Object.values(this.sounds).forEach(sound => {
        try {
          sound.pause();
        } catch (e) {
          // Ignore
        }
      });
    }
    
    return this.isMuted;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Initialize sounds - call this in your App component
export const initSounds = () => {
  if (typeof window === 'undefined') return;
  
  soundManager.preload({
    'ambient': '/sounds/ambient-loop.mp3',
    'hover': '/sounds/hover.mp3',
    'click': '/sounds/click.mp3',
    'drilldown': '/sounds/drilldown.mp3',
    'back': '/sounds/back.mp3',
    'transition': '/sounds/transition.mp3',
    'formSubmit': '/sounds/form-submit.mp3',
    'formError': '/sounds/form_error.mp3'
  });
};
