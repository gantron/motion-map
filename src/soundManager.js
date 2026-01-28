// Sound Manager for Motion-Map - Fully Lazy-Loaded

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
        console.debug('Failed to preload sound:', key);
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
      } catch (e) {}
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
      } catch (e) {}
    }
  }

  stopLoop(soundKey) {
    if (typeof window === 'undefined') return;
    
    const sound = this.sounds[soundKey];
    if (sound) {
      try {
        sound.pause();
        sound.currentTime = 0;
      } catch (e) {}
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.volume = this.volume;
      } catch (e) {}
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      Object.values(this.sounds).forEach(sound => {
        try {
          sound.pause();
        } catch (e) {}
      });
    }
    
    return this.isMuted;
  }
}

// NO instance created here - nothing runs at import time!
let _instance = null;

// Export an object with getter methods - no direct instance creation
export const soundManager = {
  get _inst() {
    if (typeof window === 'undefined') return null;
    if (!_instance) _instance = new SoundManager();
    return _instance;
  },
  
  preload(soundMap) {
    this._inst?.preload(soundMap);
  },
  
  play(soundKey) {
    this._inst?.play(soundKey);
  },
  
  playLoop(soundKey) {
    this._inst?.playLoop(soundKey);
  },
  
  stopLoop(soundKey) {
    this._inst?.stopLoop(soundKey);
  },
  
  setVolume(vol) {
    this._inst?.setVolume(vol);
  },
  
  toggleMute() {
    return this._inst?.toggleMute() || false;
  },
  
  get isMuted() {
    return this._inst?.isMuted || false;
  }
};

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
