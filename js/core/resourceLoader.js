class ResourceLoader {
  constructor() {
    this.audioFiles = [];
  }

  async loadAudioFiles() {
    try {
      const response = await fetch('/js/core/music_data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // 检查歌曲路径是否有效
      this.audioFiles = data.map(song => {
        if (!song.path.startsWith('resource/')) {
          console.warn(`歌曲路径格式不正确: ${song.path}`);
          song.path = `resource/${song.path}`;
        }
        return song;
      });
      
      console.log('成功加载音频文件:', this.audioFiles.length);
      return this.audioFiles;
    } catch (error) {
      console.error('加载音频文件失败:', error);
      throw error;
    }
  }

  getAudioFiles() {
    return this.audioFiles;
  }
}

// 确保使用默认导出
export default ResourceLoader;