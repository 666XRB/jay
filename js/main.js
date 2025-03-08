import ResourceLoader from './core/resourceLoader.js';
import AudioManager from './core/audioManager.js';
import PlayerController from './modules/playerController.js';
import PlaylistManager from './modules/playlistManager.js';
import SearchManager from './modules/search.js';
import Utils from './core/utils.js';

class MusicApp {
  constructor() {
    console.log('开始初始化音乐应用...');
    this.initModules();
  }

  async initModules() {
    this.resourceLoader = new ResourceLoader();
    this.audioManager = new AudioManager();
    this.playlistManager = new PlaylistManager(this.resourceLoader, this.audioManager);
    this.playerController = new PlayerController(this.audioManager, this.playlistManager);
    // 移除对SearchManager的初始化
    // this.searchManager = new SearchManager(this.playlistManager);
    
    try {
      console.log('开始加载音频文件...');
      const songs = await this.resourceLoader.loadAudioFiles();
      console.log('成功加载歌曲:', songs);
      
      console.log('开始初始化播放列表...');
      await this.playlistManager.initPlaylist();
      
      console.log('应用初始化完成');
    } catch (error) {
      console.error('初始化失败:', error);
    }
}
}

// 启动应用
const musicApp = new MusicApp();