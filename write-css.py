#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Write CSS files with bright orange palette."""

content_variables = """/* ==========================================
   DonTusa — Цветовая палитра и переменные
   ========================================== */

:root {
  /* Основные цвета по ТЗ */
  --color-dark: #642F37;
  --color-accent: #C0350F;
  --color-primary: #F3904B;
  --color-soft-yellow: #F7C767;
  --color-lavender: #B89DBB;

  /* Производные цвета */
  --color-dark-hover: #4E252B;
  --color-accent-hover: #A32D0D;
  --color-primary-hover: #E57A35;
  --color-lavender-hover: #A587AB;

  /* Фоны — яркие, без бледной серости */
  --bg-main: linear-gradient(135deg, #F7C767 0%, #F3904B 25%, #B89DBB 50%, #C0350F 75%, #642F37 100%);
  --bg-light: #FFF8E8;
  --bg-peach: #FFEFD5;
  --bg-lavender: #E9DDF0;
  --bg-lavender-card: rgba(184, 157, 187, 0.2);
  --bg-gray: #F5F0EA;
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-overlay: rgba(100, 47, 55, 0.85);

  /* Текст */
  --text-dark: #642F37;
  --text-light: #FFFFFF;
  --text-muted: #8A6D75;
  --text-on-dark: #FFFFFF;

  /* Границы и тени */
  --border-color: #C0350F;
  --border-light: #F3904B;
  --border-lavender: #B89DBB;
  --shadow-sm: 0 2px 4px rgba(100, 47, 55, 0.2);
  --shadow-md: 0 4px 12px rgba(100, 47, 55, 0.3);
  --shadow-lg: 0 8px 24px rgba(192, 53, 15, 0.4);

  /* Радиусы и отступы */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 50px;

  /* Переходы и анимации */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* Z-index */
  --z-dropdown: 100;
  --z-modal: 1000;
  --z-tooltip: 1100;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
  background: var(--bg-main);
  background-attachment: fixed;
  color: var(--text-dark);
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1.6;
  cursor: auto;
}

a {
  text-decoration: none;
  color: inherit;
}

ul, ol {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button, input, select, textarea {
  font-family: inherit;
}

h1, h2, h3, h4 {
  color: var(--color-dark);
  font-weight: 700;
}
"""

with open('frontend/src/styles/variables.css', 'w', encoding='utf-8') as f:
    f.write(content_variables)
print('variables.css written successfully')
