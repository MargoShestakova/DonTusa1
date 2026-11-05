#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Fix components.css

content_components = """
.card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(100, 47, 55, 0.25);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(192, 53, 15, 0.3);
}
.card-lavender {
  background: var(--bg-lavender-card);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(184, 157, 187, 0.2);
  border: 1px solid var(--border-lavender);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}
.card-lavender:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(184, 157, 187, 0.3);
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: var(--color-dark);
  color: #FFFFFF;
  z-index: 200;
  display: flex;
  flex-direction: column;
}
.sidebar-brand {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.sidebar-brand .logo-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.sidebar-brand span {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-soft-yellow);
  letter-spacing: 1px;
}
.sidebar-subtitle {
  font-size: 0.75rem;
  color: var(--color-lavender);
  font-weight: 600;
  letter-spacing: 1px;
}
.sidebar-nav {
  padding: 20px 0;
  flex: 1;
  overflow-y: auto;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  cursor: pointer;
}
.sidebar-link:hover {
  background: rgba(255,255,255,0.05);
  color: #FFFFFF;
}
.sidebar-link.active {
  background: var(--color-lavender);
  color: #FFFFFF;
  border-left: 3px solid var(--color-primary);
}
.sidebar-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.main-content {
  margin-left: 260px;
  min-height: 100vh;
  background: var(--bg-main);
  background-attachment: fixed;
  padding: 0;
}
.main-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 24px 32px;
  border-bottom: 2px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.main-header-left h1 { font-size: 1.75rem; color: var(--color-dark); margin-bottom: 4px; }
.main-header-right { display: flex; align-items: center; gap: 16px; }

.stats-section { padding: 32px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
}
.stat-icon {
  font-size: 2.5rem;
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-dark);
}
.stat-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

.content-section { padding: 32px; }
.content-section.hidden { display: none; }
.content-section.active { display: block; animation: fadeInUp 0.4s ease forwards; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.section-header h2 { font-size: 1.5rem; color: var(--color-dark); margin: 0; }

.data-table { width: 100%; border-collapse: separate; border-spacing: 0; background: rgba(255,255,255,0.85); border-radius: 12px; overflow: hidden; border: 1px solid var(--border-light); }
.data-table th {
  background: var(--color-dark);
  color: #FFFFFF;
  padding: 14px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-dark);
  font-size: 0.95rem;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover { background: var(--color-soft-yellow); }

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}
.status-active { background: #D4EDDA; color: #155724; }
.status-pending { background: #FFF3CD; color: #856404; }
.status-completed { background: var(--color-lavender); color: #FFFFFF; }
.status-cancelled { background: #F8D7DA; color: #721C24; }

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-right: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.action-btn.view { background: var(--color-lavender); color: #FFFFFF; }
.action-btn.view:hover { background: var(--color-lavender-hover); transform: scale(1.1); }
.action-btn.edit { background: var(--color-primary); color: #FFFFFF; }
.action-btn.edit:hover { background: var(--color-primary-hover); transform: scale(1.1); }
.action-btn.delete { background: var(--color-accent); color: #FFFFFF; }
.action-btn.delete:hover { background: var(--color-accent-hover); transform: scale(1.1); }

.flex-1 { flex: 1; }
"""

with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
    f.write(content_components)
print('components.css written')
