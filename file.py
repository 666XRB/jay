import os

def create_project_structure(description):
    """
    根据提供的目录结构描述创建项目结构。

    Args:
        description (str): 描述项目结构的字符串。
    """
    lines = description.strip().split('\n')
    base_path = os.getcwd()  # 获取当前工作目录
    current_path = base_path
    directory_stack = [base_path]  # 维护一个目录栈

    for line in lines:
        line = line.strip()
        if not line or line.startswith("couple-space/"):  # 忽略空行和根目录指示
            continue

        parts = line.split('├──')  # 使用 ├── 分割
        if len(parts) > 1:
            name = parts[-1].strip()
            indentation = line.index('├──')  # 找到 ├── 的位置来确定缩进
        else:
            parts = line.split('└──')  # 尝试使用 └── 分割
            if len(parts) > 1:
                name = parts[-1].strip()
                indentation = line.index('└──')  # 找到 └── 的位置来确定缩进
            else:
                continue  # 如果既没有 ├── 也没有 └──，则忽略该行

        level = indentation // 4  # 假设每个缩进级别是 4 个空格

        # 调整目录栈，确保当前目录正确
        while len(directory_stack) > level + 1:
            directory_stack.pop()
        current_path = directory_stack[-1]

        if '.' in name:  # 包含文件扩展名，表示是文件
            file_path = os.path.join(current_path, name)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)  # 确保目录存在
            with open(file_path, 'w') as f:  # 创建空文件
                pass
            print(f"创建文件: {file_path}")
        else:  # 否则是目录
            dir_path = os.path.join(current_path, name)
            try:
                os.makedirs(dir_path, exist_ok=True)
                print(f"创建目录: {dir_path}")
            except FileExistsError:
                print(f"目录已存在: {dir_path}")
            directory_stack.append(dir_path)  # 将新目录入栈

def create_music_project():
    """创建音乐网站项目结构"""
    project_structure = """
music-website/
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── player.css
│   └── responsive.css
├── js/
│   ├── core/
│   │   ├── audio.js
│   │   ├── utils.js
│   │   └── event.js
│   ├── modules/
│   │   ├── player.js
│   │   ├── playlist.js
│   │   ├── search.js
│   │   └── drag.js
│   └── main.js
├── resource/
│   ├── song1.mp3
│   ├── song2.mp3
├── images/
│   ├── icons/
│   │   ├── play.png
│   │   ├── pause.png
│   └── author-icon.png
└── docs/
    ├── README.md
    └── development.md
"""
    create_project_structure(project_structure)

if __name__ == "__main__":
    create_music_project()
    print("音乐网站项目结构创建完成！")