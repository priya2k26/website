import os

css_content = """
/* ==================== READY ORDERS NEW DESIGN ==================== */
.ready-orders-page-wrapper {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    animation: fadeIn 0.8s ease-out;
}

.ro-header-card {
    background: white;
    border-radius: 12px;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    animation: slideInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ro-header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.ro-header-icon {
    width: 60px;
    height: 60px;
    background: #f0f4ff;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    position: relative;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}

.ro-icon-check {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 24px;
    height: 24px;
    background: #00e676;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    border: 2px solid white;
    font-weight: bold;
    animation: bounce 2s infinite;
}

.ro-header-text h1 {
    font-size: 22px;
    margin: 0 0 5px 0;
    color: #112a46;
}

.ro-header-text p {
    margin: 0;
    color: #777;
    font-size: 14px;
}

.ro-header-actions {
    display: flex;
    gap: 15px;
}

.ro-btn-tracking {
    background: linear-gradient(135deg, #40c4ff 0%, #00b0ff 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 176, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ro-btn-tracking:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 176, 255, 0.4);
}

.ro-btn-logout {
    background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(255, 23, 68, 0.3);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ro-btn-logout:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 23, 68, 0.4);
}

.ro-main-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    min-height: 500px;
    animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.ro-main-header {
    margin-bottom: 30px;
}

.ro-main-title {
    display: flex;
    align-items: center;
    gap: 15px;
}

.ro-table-icon {
    font-size: 32px;
    color: #673ab7;
    animation: pulse 2s infinite;
}

.ro-main-title h2 {
    margin: 0 0 5px 0;
    color: #112a46;
    font-size: 20px;
}

.ro-main-title p {
    margin: 0;
    color: #888;
    font-size: 14px;
}

.ro-list-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.ro-table-row {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 10px;
    padding: 15px 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    border: 1px solid #f0f0f0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0;
    animation: slideInRight 0.5s ease-out forwards;
}

.ro-table-row:hover {
    transform: translateX(5px) scale(1.01);
    box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

/* Row colors */
.row-color-1 { border-left: 5px solid #2e7d32; }
.row-color-2 { border-left: 5px solid #1565c0; }
.row-color-3 { border-left: 5px solid #6a1b9a; }
.row-color-4 { border-left: 5px solid #e65100; }
.row-color-5 { border-left: 5px solid #00695c; }

.ro-table-pill {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    font-weight: bold;
    transition: transform 0.3s;
}
.ro-table-row:hover .ro-table-pill {
    transform: scale(1.1);
}

.pill-1 { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.pill-2 { background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb; }
.pill-3 { background: #f3e5f5; color: #6a1b9a; border: 1px solid #e1bee7; }
.pill-4 { background: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }
.pill-5 { background: #e0f2f1; color: #00695c; border: 1px solid #b2dfdb; }

.ro-pill-title { font-size: 10px; opacity: 0.8; }
.ro-pill-number { font-size: 20px; line-height: 1; margin: 2px 0; }
.ro-pill-icon { font-size: 14px; }

.ro-table-info {
    flex: 1;
}

.ro-status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    margin-bottom: 5px;
    font-size: 14px;
}

.ro-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.dot-avail { background: #00e676; }
.dot-occ { background: #ff9100; }

.text-avail { color: #00c853; }
.text-occ { color: #ff6d00; }

.text-avail-1 { color: #2e7d32; }
.text-avail-2 { color: #1565c0; }
.text-avail-3 { color: #6a1b9a; }
.text-avail-4 { color: #e65100; }
.text-avail-5 { color: #00695c; }

.ro-order-details {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #777;
    font-size: 13px;
}

.ro-detail-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.ro-badge {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-right: 15px;
}

.badge-avail {
    background: #e8f5e9;
    color: #2e7d32;
}

.badge-ready {
    background: #fff3e0;
    color: #e65100;
    animation: glow 2s infinite alternate;
}

.ro-action-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 1px solid #eaeaea;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #112a46;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ro-table-row:hover .ro-action-btn {
    background: #f0f4ff;
    border-color: #1976d2;
    color: #1976d2;
    transform: translateX(3px);
}
.ro-action-btn:hover {
    background: #1976d2 !important;
    color: white !important;
}

"""

with open(r'c:\Users\Hope3\Desktop\website\styles.css', 'a', encoding='utf-8') as f:
    f.write(css_content)
