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
      
      // ������·���Ƿ���Ч
      this.audioFiles = data.map(song => {
        if (!song.path.startsWith('resource/')) {
          console.warn(`����·����ʽ����ȷ: ${song.path}`);
          song.path = `resource/${song.path}`;
        }
        return song;
      });
      
      console.log('�ɹ�������Ƶ�ļ�:', this.audioFiles.length);
      return this.audioFiles;
    } catch (error) {
      console.error('������Ƶ�ļ�ʧ��:', error);
      throw error;
    }
  }

  getAudioFiles() {
    return this.audioFiles;
  }
}

// ȷ��ʹ��Ĭ�ϵ���
export default ResourceLoader;