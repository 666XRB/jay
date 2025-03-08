import os
import json
import re

def parse_filename(filename):
    # 匹配 "歌手 - 歌曲名.mp3" 格式
    pattern = r'^(.*?)\s*-\s*(.*?)\.mp3$'
    match = re.match(pattern, filename)
    if match:
        return {
            'artist': match.group(1).strip(),
            'name': match.group(2).strip()
        }
    return {
        'artist': '未知歌手',
        'name': os.path.splitext(filename)[0].strip()
    }

def scan_music_directory(directory):
    music_data = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.mp3'):
                # 使用相对路径
                relative_path = os.path.relpath(os.path.join(root, file), start=os.getcwd())
                file_info = parse_filename(file)
                
                music_data.append({
                    'name': file_info['name'],
                    'artist': file_info['artist'],
                    'album': '未知专辑',
                    'path': relative_path.replace('\\', '/'),  # 确保使用正斜杠
                    'searchable': f"{file_info['name']} {file_info['artist']}"
                })
    
    return music_data

def save_music_data(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    music_dir = os.path.join(os.getcwd(), 'resource')
    output_file = os.path.join(os.getcwd(), 'js', 'core', 'music_data.json')
    
    if not os.path.exists(music_dir):
        os.makedirs(music_dir)
    
    music_data = scan_music_directory(music_dir)
    save_music_data(music_data, output_file)
    print(f"成功生成音乐数据文件: {output_file}")