class PlaylistManager {
  constructor(resourceLoader, audioManager) {
    this.resourceLoader = resourceLoader;
    this.audioManager = audioManager;
    this.songList = document.getElementById('songList');
    this.currentSongIndex = -1;
    this.originalSongs = [];
  }
  async initPlaylist() {
    try {
      console.log('开始初始化播放列表...');
      const songs = await this.resourceLoader.getAudioFiles();
      this.originalSongs = [...songs];
      this.renderPlaylist(songs);
      this.setupEventListeners();  // 确保调用事件监听器设置
      
      if (songs.length > 0) {
        console.log('准备播放第一首歌曲...');
        await this.playSong(0); // 自动播放第一首
      } else {
        console.warn('播放列表为空，请添加歌曲');
      }
    } catch (error) {
      console.error('初始化播放列表失败:', error);
    }
  }
  async playSong(index) {
    if (index === this.currentSongIndex) {
      this.audioManager.togglePlay();
      return;
    }

    this.currentSongIndex = index;
    const song = this.originalSongs[index];
    try {
      // 清除旧的结束事件监听器
      this.audioManager.clearEndedListeners();
      
      await this.audioManager.load(song.path);
      this.audioManager.play();
      this.updateNowPlaying(song);
      this.highlightCurrentSong();
      
      // 修改歌曲结束事件监听（核心修改部分）
      this.audioManager.audio.addEventListener('ended', () => {
        this.playNextSong(); // 直接调用播放下一首方法
      });
    } catch (error) {
      console.error('播放失败:', error);
    }
  }
setupEventListeners() {
  // 添加歌曲点击事件
  this.songList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) {
      const index = parseInt(li.dataset.index);
      this.playSong(index);
    }
  });

  // 添加搜索框事件监听
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      this.searchSongs(e.target.value);
    });
  }
}
  searchSongs(keyword) {
    if (!keyword || keyword.trim() === '') {
      // 如果搜索框为空，显示初始化歌曲列表
      this.renderPlaylist(this.originalSongs);
      return;
    }
  
    const filteredSongs = this.originalSongs.filter(song => {
      return song.name.toLowerCase().includes(keyword.toLowerCase()) || 
             song.artist.toLowerCase().includes(keyword.toLowerCase());
    });
  
    this.renderPlaylist(filteredSongs);
  }
  getOriginalSongs() {
    return this.originalSongs;
  }
  // 渲染播放列表
  renderPlaylist(songs) {
    console.log('开始渲染播放列表，歌曲数量:', songs.length);
    if (!this.songList) {
        console.error('无法找到songList元素');
        return;
    }
    
    this.songList.innerHTML = ''; // 清空现有列表
    
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'song-item';
        li.dataset.index = this.originalSongs.indexOf(song); // 使用原始列表的索引
        
        // 创建歌曲信息容器
        const songInfo = document.createElement('div');
        songInfo.className = 'song-info';
        
        // 歌曲名称
        const songName = document.createElement('span');
        songName.className = 'song-name';
        songName.textContent = song.name;
        
        // 歌手信息
        const artist = document.createElement('span');
        artist.className = 'song-artist';
        artist.textContent = ` - ${song.artist}`;
        
        // 组合元素
        songInfo.appendChild(songName);
        songInfo.appendChild(artist);
        li.appendChild(songInfo);
        
        // 添加到列表
        this.songList.appendChild(li);
    });
    
    console.log('播放列表渲染完成');
  }
  highlightKeyword(text, keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  async playSong(index) {
    if (index === this.currentSongIndex) {
      this.audioManager.togglePlay();
      return;
    }
  
    this.currentSongIndex = index;
    const song = this.originalSongs[index];
    try {
      await this.audioManager.load(song.path);
      this.audioManager.play();
      this.updateNowPlaying(song);  // 修改这里，传入整个song对象
      this.highlightCurrentSong();
      
      // 修改歌曲结束事件监听，实现自动重新播放
      this.audioManager.audio.addEventListener('ended', () => {
        this.playSong(index); // 重新播放当前歌曲
      });
    } catch (error) {
      console.error('播放失败:', error);
    }
  }
  // 更新当前播放信息
  // 更新当前播放信息（删除重复的方法）
  // 删除重复的方法定义（第191-196行）
  // 修改现有的updateNowPlaying实现
  updateNowPlaying(song) {
    try {
      if (!song || typeof song !== 'object') {
        throw new Error('无效的歌曲对象，请检查数据来源');
      }
      
      const nowPlayingElement = document.querySelector('.now-playing');
      if (nowPlayingElement) {
        console.log('当前歌曲对象:', song); // 添加调试日志
        nowPlayingElement.textContent = `当前播放：${song.name} - ${song.artist}`;
        document.title = `${song.name} - ${song.artist} | 杰伦Music`;
      }
    } catch (error) {
      console.error('更新播放信息失败:', error);
      // 触发全局错误事件
      document.dispatchEvent(new CustomEvent('playerError', {
        detail: { message: error.message }
      }));
    }
  }
  playNextSong() {
    const nextIndex = (this.currentSongIndex + 1) % this.originalSongs.length;
    this.playSong(nextIndex); // 循环播放逻辑
  }
  playPreviousSong() {
    const total = this.originalSongs.length;
    const prevIndex = (this.currentSongIndex - 1 + total) % total;
    console.log(`上一首计算：当前索引 ${this.currentSongIndex}, 总数 ${total}, 新索引 ${prevIndex}`);
    this.playSong(prevIndex);
  }
  highlightCurrentSong() {
    const songItems = this.songList.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
      if (index === this.currentSongIndex) {
        item.classList.add('active');
        // 添加动画效果
        item.animate([
          { transform: 'scale(1)', backgroundColor: 'rgba(255,255,255,0.1)' },
          { transform: 'scale(1.02)', backgroundColor: 'rgba(29,185,84,0.2)' },
          { transform: 'scale(1)', backgroundColor: 'rgba(29,185,84,0.1)' }
        ], {
          duration: 300,
          easing: 'ease-out'
        });
      } else {
        item.classList.remove('active');
      }
    });
  }
  // 新增获取当前索引方法
  get currentIndex() {
    return this.currentSongIndex;
  }

  // 新增获取歌曲总数方法
  getTotalSongs() {
    return this.originalSongs.length;
  }
  playRandomSong() {
    if (this.originalSongs.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * this.originalSongs.length);
    console.log(`随机播放：选中第 ${randomIndex + 1} 首歌曲`);
    this.playSong(randomIndex);
  }
}

// 确保使用默认导出
export default PlaylistManager;