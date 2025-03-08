class PlayerController {
  constructor(audioManager, playlistManager) {
    this.audioManager = audioManager;
    this.playlistManager = playlistManager;
    this.initControls();
    this.initEventListeners();
  }
  initControls() {
    // 音量控制
    const volumeControl = document.getElementById('volume');
    volumeControl.addEventListener('input', (e) => {
      this.audioManager.setVolume(e.target.value);
    });
  
    // 播放/暂停按钮
    document.getElementById('playPauseBtn').addEventListener('click', () => {
      this.audioManager.togglePlay();
      this.updatePlayButton();
    });
  
    // 进度条控制
    const progressBar = document.querySelector('.progress-bar');
    let isDragging = false;
  // 在initControls方法中添加：
  // 添加触摸事件支持
  progressBar.addEventListener('touchstart', (e) => {
  this.handleProgressClick(e.touches[0]);
  });
  
  progressBar.addEventListener('touchmove', (e) => {
  this.handleProgressClick(e.touches[0]);
  });
  // 统一处理指针事件
  progressBar.addEventListener('pointerdown', e => {
    isDragging = true;
    this.handleProgressClick(e);
  });
  
  document.addEventListener('pointermove', e => {
    if (isDragging) {
      this.handleProgressClick(e);
    }
  });
  
  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
  // 移动端优化
  progressBar.style.touchAction = 'none'; // 防止页面滚动
}
  handleProgressClick(e) {
    const progressBar = document.querySelector('.progress-bar');
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
    const time = percent * this.audioManager.getDuration();
    this.audioManager.seek(time);
  }
  initEventListeners() {
    document.addEventListener('songEnded', () => {
      this.playNextSong();
    });
  // 添加按钮事件绑定
  // 添加上一首按钮监听（新增代码）
  document.getElementById('prevBtn').addEventListener('click', () => {
    this.playlistManager.playPreviousSong();
  });
  // 添加下一首按钮监听（已存在的代码）
  document.getElementById('nextBtn').addEventListener('click', () => {
    this.playlistManager.playNextSong();
  });
  // 添加随机按钮监听
  document.getElementById('randomBtn').addEventListener('click', () => {
    this.playlistManager.playRandomSong();
  });
  }
  // 新增上一首功能
  playPreviousSong() {
    const newIndex = (this.playlistManager.currentSongIndex - 1 + this.playlistManager.originalSongs.length) % 
                     this.playlistManager.originalSongs.length;
    this.playlistManager.playSong(newIndex);
  }
  // 新增下一首功能
  playNextSong() {
    const newIndex = (this.playlistManager.currentSongIndex + 1) % 
                     this.playlistManager.originalSongs.length;
    this.playlistManager.playSong(newIndex);
  }
  playPreviousSong() {
    const currentIndex = this.playlistManager.currentSongIndex;
    if (currentIndex > 0) {
      this.playlistManager.playSong(currentIndex - 1);
    }
  }
  updatePlayButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.textContent = this.audioManager.isPlaying ? '暂停' : '播放';
  }
}





// 确保使用默认导出
export default PlayerController;



