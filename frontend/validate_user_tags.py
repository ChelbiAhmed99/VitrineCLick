
import re

def validate_tags(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find the template content
    template_match = re.search(r'template: `(.*?)`', content, re.DOTALL)
    if not template_match:
        print("Template not found")
        return
    
    template = template_match.group(1)
    lines = template.split('\n')
    
    stack = []
    
    for i, line in enumerate(lines):
        # Match tags like <div, </div>, <main, </main>, <section, </section>
        # Also need to handle <svg>, <path>, etc. but let's focus on block elements first
        # Actually, Angular error often comes from mismatched div/main.
        tags = re.findall(r'<(div|/div|main|/main|section|/section|nav|/nav|table|/table|tbody|/tbody|tr|/tr|th|/th|td|/td|ul|/ul|li|/li|button|/button|span|/span|a|/a|h1|/h1|h2|/h2|h3|/h3|p|/p|svg|/svg|path|/path|defs|/defs|linearGradient|/linearGradient|stop|/stop|filter|/filter|feGaussianBlur|/feGaussianBlur|feComposite|/feComposite|img|label|input|textarea|select|option)', line)
        
        for tag in tags:
            # Skip self-closing or tags that don't need closing in this simple regex (img, input, etc.)
            if tag in ['img', 'input', 'textarea', 'stop', 'feGaussianBlur', 'feComposite']:
                continue
                
            if tag.startswith('/'):
                tname = tag[1:]
                if not stack:
                    print(f"Unexpected closing tag </{tname}> at line {i+1}")
                else:
                    opening, oline = stack.pop()
                    if opening != tname:
                        print(f"Mismatched closing tag </{tname}> for <{opening}> (opened at line {oline}) at line {i+1}")
                        # Push opening back to keep stack as sane as possible? No, usually it's one tag missing.
            else:
                stack.append((tag, i+1))

    if stack:
        print("Unclosed tags:")
        for tag, line in stack:
            print(f"  <{tag}> opened at line {line}")

validate_tags('/home/choubi/Desktop/vitrineclick/frontend/src/app/user/user.component.ts')
