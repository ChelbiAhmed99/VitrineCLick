
import re

file_path = '/home/choubi/Desktop/vitrineclick/frontend/src/app/user/user.component.ts'

with open(file_path, 'r') as f:
    content = f.read()

# Extract the template content between `template: ` and the backtick
template_match = re.search(r'template:\s*`([\s\S]*?)`', content)
if not template_match:
    print("Template not found")
    exit()

template = template_match.group(1)
template_start_line = content[:template_match.start()].count('\n') + 1

# Find all div openings and closings
tags = re.findall(r'<(div|main|aside|header|footer|nav|section|article)|</(div|main|aside|header|footer|nav|section|article)>', template)

stack = []
for i, tag in enumerate(re.finditer(r'<(div|main|aside|header|footer|nav|section|article)|</(div|main|aside|header|footer|nav|section|article)>', template)):
    full_tag = tag.group(0)
    line_num = template_start_line + template[:tag.start()].count('\n')
    
    if full_tag.startswith('</'):
        tag_name = full_tag[2:-1]
        if not stack:
            print(f"Unexpected closing tag {tag_name} at line {line_num}")
        else:
            last_tag, last_line = stack.pop()
            if last_tag != tag_name:
                print(f"Mismatched tag: opened {last_tag} at line {last_line}, closed {tag_name} at line {line_num}")
    else:
        tag_name = full_tag[1:]
        # Filter out self-closing tags (though we didn't match the closing part in the regex above)
        # Actually, let's just check if it's a self-closing div or something (unlikely in Angular)
        stack.append((tag_name, line_num))

for tag_name, line_num in stack:
    print(f"Unclosed tag {tag_name} at line {line_num}")
