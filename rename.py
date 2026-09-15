import os

REPLACEMENTS = {
    'viva-': 'enterprise-',
    'academic-': 'enterprise-',
    'Viva': 'Enterprise',
    'ACADEMIC': 'ENTERPRISE',
    'College AI Project': 'Enterprise Grid Monitoring',
    'EE Capstone': 'Enterprise',
    'Student Evaluator': 'System Administrator'
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
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css') or file.endswith('.js'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
