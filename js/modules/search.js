class SearchManager {
  constructor(playlistManager) {
    this.playlistManager = playlistManager;
    this.searchInput = document.getElementById('searchInput');
    this.init();  // 移除对searchButton的引用
  }

  init() {
    // 移除按钮事件绑定
    this.searchInput.addEventListener('input', () => this.handleSearch());
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });
  }
}

export default SearchManager;