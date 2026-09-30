import re

def fix_css():
    with open('css/style.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Global Box Sizing and Overflow
    css = re.sub(r'body\s*{[^}]*}', r'''body {
  font-family: var(--font-body);
  color: var(--body);
  background-color: var(--white);
  line-height: 1.6;
  font-size: clamp(1rem, 3.8vw, 1.15rem);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

html, body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

a {
  word-break: normal;
}
''', css)

    # 2. Typography
    css = re.sub(r'h1\s*{\s*font-size:\s*clamp[^;]+;\s*}', 'h1 { font-size: clamp(2.2rem, 8vw, 4.5rem); }', css)
    css = re.sub(r'h2\s*{\s*font-size:\s*clamp[^;]+;\s*}', 'h2 { font-size: clamp(1.8rem, 6vw, 3rem); }', css)
    
    # 3. Buttons
    css = re.sub(r'\.btn\s*{([^}]+)}', r'.btn {\1\n  min-height: 44px;\n  padding: 12px 20px;\n}', css)

    # 4. Move Header breakpoints from 768px to 992px
    # In @media (min-width: 768px), remove header stuff
    # This is tricky with regex, let's just do targeted replacements.
    
    # Remove these from 768px
    to_remove = [
        r'\.hamburger\s*{\s*display:\s*none;\s*}',
        r'\.mobile-menu\s*{\s*display:\s*none;\s*}',
        r'\.nav-menu\s*{\s*display:\s*flex;\s*gap:\s*1\.5rem;\s*}',
        r'\.nav-menu a\s*{\s*font-weight:\s*500;\s*position:\s*relative;\s*font-size:\s*0\.95rem;\s*}',
        r'\.nav-actions\s*{\s*display:\s*flex;\s*align-items:\s*center;\s*}'
    ]
    for r in to_remove:
        css = re.sub(r, '', css)
        
    # And add them to 992px
    addition = '''
  .hamburger { display: none; }
  .mobile-menu { display: none; }
  .nav-menu { display: flex; gap: 1.5rem; }
  .nav-menu a { font-weight: 500; position: relative; font-size: 0.95rem; }
  .nav-actions { display: flex; align-items: center; }
'''
    css = css.replace('@media (min-width: 992px) {', '@media (min-width: 992px) {' + addition)

    # 5. Fix Mobile spacing
    css = css.replace('.section { padding: 4rem 0 6rem 0;', '.section { padding: 3rem 0; box-sizing: border-box; width: 100%; max-width: 100%; overflow-x: hidden;')
    
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css)

def fix_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Remove the logo from mobile menu to avoid "duplicated logo" feeling
    html = re.sub(r'<div class="text-center mb-2">\s*<img src="images/logo\.png"[^>]+>\s*</div>', '', html)
    
    # Ensure viewport meta tag is correct
    if 'viewport' in html and 'initial-scale=1' in html:
        html = html.replace('width=device-width, initial-scale=1.0', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

fix_css()
fix_html()
print("Mobile fixes applied.")
