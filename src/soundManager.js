// Sound Manager for Motion-Map - SSR Safe

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.volume = 0.3;
  }

  preload(soundMap) {
    if (typeof window === 'undefined') return;
    
    Object.entries(soundMap).forEach(([key, path]) => {
      try {
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.preload = 'auto';
        this.sounds[key] = audio;
      } catch (e) {
        // Ignore
      }
    });
  }

  play(soundKey) {
    if (typeof window === 'undefined' || this.isMuted) return;
    
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
    if (typeof window === 'undefined' || this.isMuted) return;
    
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
    if (typeof window === 'undefined') return;
    
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

// Only create instance in browser
let instance = null;
function getInstance() {
  if (typeof window === 'undefined') {
    // Return no-op for SSR
    return {
      preload: () => {},
      play: () => {},
      playLoop: () => {},
      stopLoop: () => {},
      setVolume: () => {},
      toggleMute: () => false,
      isMuted: false
    };
  }
  if (!instance) {
    instance = new SoundManager();
  }
  return instance;
}

export const soundManager = getInstance();

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
