class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous'; // 解决CORS问题
    this.setupIOSCompatibility();
    this.isPlaying = false;
    this.currentTime = 0;
    this.volume = 0.5;
    this.initEventListeners();
  }
  async play() {
    try {
      if (typeof this.audio.play().catch === 'function') {
        await this.audio.play();
      }
    } catch (error) {
      console.log('需要用户交互:', error);
    }
  }
  // 新增iOS兼容方法
  setupIOSCompatibility() {
    document.body.addEventListener('touchstart', () => {
      if (this.audioContextState === 'suspended') {
        this.audio.play().catch(() => {});
      }
    }, { once: true });
  }
  // 添加清除结束事件监听器的方法
  clearEndedListeners() {
    const newAudio = this.audio.cloneNode();
    this.audio.replaceWith(newAudio);
    this.audio = newAudio;
  }

  initEventListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
      
      // 检查是否接近歌曲结束（最后1秒）
      if (this.audio.duration - this.currentTime < 1) {
        const nextButton = document.getElementById('nextBtn');
        if (nextButton) {
          nextButton.click(); // 直接触发下一首按钮
        }
      }

      // 触发自定义事件
      const event = new CustomEvent('timeUpdate', {
        detail: {
          currentTime: this.currentTime,
          duration: this.audio.duration
        }
      });
      document.dispatchEvent(event);
    });
  }
  async load(url) {
    this.audio.src = url;
    // 添加元数据预加载
    await new Promise(resolve => {
      this.audio.addEventListener('loadedmetadata', resolve);
    });
    return new Promise((resolve, reject) => {
      this.audio.addEventListener('canplaythrough', resolve);
      this.audio.addEventListener('error', reject);
    });
  }
  // 新增按钮状态更新方法
  updatePlayButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
      playPauseBtn.textContent = this.isPlaying ? '暂停' : '播放';
    }
  }
  play() {
    // 删除重复的play调用，保留iOS兼容逻辑
    if (this.audio.paused) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          this.isPlaying = true;
          this.updatePlayButton();
          // 移除此处的audio.play()
        }).catch(error => {
          console.log('需要用户交互:', error);
          this.isPlaying = false; // 确保状态同步
          this.updatePlayButton();
        });
      }
    } else {
      // 保留原有播放状态恢复逻辑
      this.audio.play();
      this.isPlaying = true;
      this.updatePlayButton();
    }

    // 触发播放状态更新事件（保持不变）
    const event = new CustomEvent('playStateChanged', {
      detail: {
        isPlaying: this.isPlaying
      }
    });
    document.dispatchEvent(event);
  }
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton(); // 调用更新方法
    
    // 触发播放状态更新事件
    const event = new CustomEvent('playStateChanged', {
      detail: {
        isPlaying: this.isPlaying
      }
    });
    document.dispatchEvent(event);
  }
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  // 设置音量
  setVolume(volume) {
    this.volume = Math.min(Math.max(volume, 0), 1);
    this.audio.volume = this.volume;
  }

  // 跳转到指定时间
  seek(time) {
    this.audio.currentTime = time;
  }

  // 获取音频时长
  getDuration() {
    return this.audio.duration;
  }
// 修改updateProgress方法
updateProgress() {
  // 添加安全校验
  const duration = this.audio.duration || 0;
  const currentTime = this.audio.currentTime || 0;
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const progressBar = document.querySelector('.progress');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    
    // 更新时间显示逻辑
    const currentTimeElement = document.querySelector('.current-time');
    const durationElement = document.querySelector('.duration');
    
    if (currentTimeElement) {
      currentTimeElement.textContent = this.formatTime(currentTime);
    }
    
    if (durationElement) {
      durationElement.textContent = duration > 0 ? this.formatTime(duration) : '0:00';
    }
  }
}



  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  triggerNextSong() {
    const event = new CustomEvent('songEnded');
    document.dispatchEvent(event);
  }
}

// 确保使用默认导出
export default AudioManager;
