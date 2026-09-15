import os

REPLACEMENTS = {
    'GridPulse AI': 'VoltGuard',
    'GridPulse': 'VoltGuard',
    'gridpulse': 'voltguard'
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in REPLACEMENTS.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    # Only walk src and backend folders
    directories_to_scan = ['src', 'backend']
    for root_dir in directories_to_scan:
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if file.endswith(('.jsx', '.js', '.css', '.html')):
                    process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
