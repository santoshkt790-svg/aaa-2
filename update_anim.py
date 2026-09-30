import re

def smart_update_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to replace 'reveal' or 'reveal-up' with alternating 'reveal-left', 'reveal-zoom', 'reveal-right'
    # but let's keep it simple: 
    # Info cards -> alternating
    # Service cards -> alternating
    # Panch cards -> alternating
    # Doctor cards -> alternating
    # Facility cards -> alternating
    # Blog cards -> alternating

    # A regex to find all reveal classes that are not reveal-left, reveal-right, reveal-zoom, reveal-fade
    # and replace them with alternating classes.
    # Actually, the user wants sliding from left and right everywhere.
    
    # Let's find all instances of 'reveal' (that are not already reveal-left/right etc)
    # and replace them sequentially.
    
    count = 0
    def replacer(match):
        nonlocal count
        # Don't replace if it's already a specialized reveal
        if match.group(1):
            return match.group(0)
        
        classes = ['reveal-left', 'reveal-zoom', 'reveal-right', 'reveal-left', 'reveal-right']
        cls = classes[count % len(classes)]
        count += 1
        return 'class="' + match.group(0).split('class="')[1].replace('reveal', cls)

    # This is a bit too destructive as it hits headers too.
    # Let's just do targeted line ranges.

    with open('index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    def replace_on_lines(start, end):
        c = 0
        for i in range(start-1, end):
            if i >= len(lines): break
            if 'reveal' in lines[i]:
                # replace the first 'reveal' or 'reveal-up' or 'reveal-zoom'
                cls = ['reveal-left', 'reveal-zoom', 'reveal-right'][c % 3]
                lines[i] = re.sub(r'\breveal(-[a-z]+)?\b', cls, lines[i])
                c += 1

    # Overlapping info cards (around 160-180)
    replace_on_lines(150, 180)
    # About values (190-220)
    replace_on_lines(190, 220)
    # Services (230-280)
    replace_on_lines(230, 280)
    # Panchakarma (290-330)
    replace_on_lines(290, 330)
    # Process (390-420)
    replace_on_lines(390, 420)
    # Doctors (430-460)
    replace_on_lines(430, 460)
    # Facilities (470-510)
    replace_on_lines(470, 510)
    # Blog cards (610-650)
    replace_on_lines(610, 650)

    # Why choose us image is around line 335
    for i in range(330, 345):
        if 'img' in lines[i] and 'reveal' in lines[i]:
            lines[i] = re.sub(r'\breveal(-[a-z]+)?\b', 'reveal-left', lines[i])
    
    # Contact is around 660-700
    for i in range(660, 680):
        if 'contact-info-wrap' in lines[i]:
            lines[i] = re.sub(r'\breveal(-[a-z]+)?\b', 'reveal-left', lines[i])
    for i in range(680, 700):
        if 'contact-form-wrap' in lines[i]:
            lines[i] = re.sub(r'\breveal(-[a-z]+)?\b', 'reveal-right', lines[i])

    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print("HTML animations updated successfully.")

if __name__ == '__main__':
    smart_update_html()
