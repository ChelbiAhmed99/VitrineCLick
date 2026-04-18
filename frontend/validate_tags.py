
import re

def validate_tags(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find all div tags
    tags = re.findall(r'<(div|\/div|main|\/main|section|\/section)', content)
    
    stack = []
    line_nums = []
    
    # We need line numbers too
    lines = content.split('\n')
    for i, line in enumerate(lines):
        line_tags = re.findall(r'<(div|\/div|main|\/main|section|\/section)', line)
        for tag in line_tags:
            if tag.startswith('/'):
                if not stack:
                    print(f"Unexpected closing tag </{tag[1:]}> at line {i+1}")
                else:
                    opening = stack.pop()
                    if opening != tag[1:]:
                        print(f"Mismatched closing tag </{tag[1:]}> for <{opening}> at line {i+1}")
            else:
                stack.append(tag)
                line_nums.append(i+1)

    if stack:
        print(f"Unclosed tags at end of file: {stack}")
        # To find where they were opened:
        # This is a bit harder because we popped from stack. 
        # Let's just re-run with a simpler stack that keeps line info.
        stack_info = []
        for i, line in enumerate(lines):
            line_tags = re.findall(r'<(div|\/div|main|\/main|section|\/section)', line)
            for tag in line_tags:
                if tag.startswith('/'):
                    if stack_info: stack_info.pop()
                else:
                    stack_info.append((tag, i+1))
        
        for tag, line in stack_info:
            print(f"Unclosed <{tag}> opened at line {line}")

validate_tags('/home/choubi/Desktop/logo for your website/vitrineclick/frontend/src/app/app.html')
