import os

css_content = """
/* ==================== NEW BILL PAGE DESIGN ==================== */
.bill-page-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    animation: fadeIn 0.8s ease-out;
}

.bill-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    animation: slideInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-back-outline {
    background: transparent;
    border: 1px solid #dcdcdc;
    color: #1976d2;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: white;
}
.btn-back-outline:hover {
    background: #f0f8ff;
    border-color: #1976d2;
    transform: translateX(-4px);
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.15);
}

.bill-page-title {
    font-size: 24px;
    font-weight: bold;
    color: #112a46;
    margin: 0;
}

.bill-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border: 1px solid #eaeaea;
    animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    transition: box-shadow 0.3s ease;
}
.bill-card:hover {
    box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.bill-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.invoice-title {
    font-size: 28px;
    color: #112a46;
    margin: 0 0 5px 0;
    font-weight: 800;
    letter-spacing: 1px;
}

.invoice-subtitle {
    color: #888;
    margin: 0;
    font-size: 15px;
}

.receipt-icon-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #4caf50;
    background: white;
    animation: bounce 2s infinite ease-in-out;
}

.divider-line {
    height: 1px;
    background: #eaeaea;
    margin: 20px 0;
    transform-origin: left;
    animation: scaleIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bill-meta-grid {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0;
    animation: fadeIn 0.6s ease-out forwards;
}
.meta-item:nth-child(1) { animation-delay: 0.1s; }
.meta-item:nth-child(2) { animation-delay: 0.2s; }
.meta-item:nth-child(3) { animation-delay: 0.3s; }

.meta-label {
    color: #777;
    font-size: 14px;
    font-weight: 600;
}

.meta-pill {
    padding: 6px 15px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 15px;
    display: inline-block;
    transition: transform 0.2s;
}
.meta-pill:hover {
    transform: scale(1.05);
}

.blue-pill { background: #e3f2fd; color: #1565c0; }
.green-pill { background: #e8f5e9; color: #2e7d32; }
.yellow-pill { background: #fff8e1; color: #f57f17; }

.new-bill-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
    opacity: 0;
    animation: fadeIn 0.8s ease-out 0.4s forwards;
}

.new-bill-table th {
    background: #112a46;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
}

.new-bill-table td {
    padding: 15px 12px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
}

.new-bill-table tbody tr {
    transition: all 0.3s ease;
}
.new-bill-table tbody tr:hover {
    background: #fcfcfc;
    transform: translateX(5px);
}

.item-name-cell {
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: 700;
    color: #333;
}

.bill-item-img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.new-bill-table tbody tr:hover .bill-item-img {
    transform: scale(1.1) rotate(2deg);
}

.bill-summary-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 20px;
    padding-right: 12px;
    opacity: 0;
    animation: slideInRight 0.6s ease-out 0.6s forwards;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    width: 300px;
    font-size: 16px;
    color: #555;
    transition: all 0.2s;
}
.summary-line:hover {
    color: #112a46;
    transform: scale(1.02);
}

.total-amount-line {
    font-weight: bold;
    color: #112a46;
    font-size: 18px;
    margin-top: 10px;
    border-top: 1px dashed #ccc;
    padding-top: 15px;
}

.total-price-green {
    color: #4caf50;
    font-size: 20px;
}

.payment-status-box {
    background: #f1f8e9;
    border: 1px solid #c5e1a5;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    opacity: 0;
    animation: slideInUp 0.6s ease-out 0.7s forwards;
    transition: all 0.3s;
}
.payment-status-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.15);
}

.check-circle {
    width: 24px;
    height: 24px;
    border: 2px solid #4caf50;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4caf50;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.paid-text {
    color: #4caf50;
}

.pending-text {
    color: #ff9800;
}

.thank-you-msg {
    color: #666;
    margin-bottom: 30px;
    font-size: 15px;
    opacity: 0;
    animation: fadeIn 0.6s ease-out 0.8s forwards;
}
.thank-you-msg:hover {
    animation: pulse 1s infinite;
}

.bill-action-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    opacity: 0;
    animation: slideInUp 0.6s ease-out 0.9s forwards;
}

.btn-print, .btn-mark-paid, .btn-complete, .btn-cancel-order {
    flex: 1;
    padding: 12px 0;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: none;
    position: relative;
    overflow: hidden;
}

.btn-print {
    background: white;
    border: 1px solid #1976d2;
    color: #1976d2;
}
.btn-print:hover { 
    background: #f0f8ff; 
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(25, 118, 210, 0.15);
}
.btn-print:active { transform: translateY(0); }

.btn-mark-paid {
    background: linear-gradient(135deg, #9b5de5 0%, #764ba2 100%);
    color: white;
}
.btn-mark-paid:hover { 
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(155, 93, 229, 0.3);
}
.btn-mark-paid:active { transform: translateY(0); }

.btn-complete {
    background: linear-gradient(135deg, #11998e 0%, #00b09b 100%);
    color: white;
}
.btn-complete:hover { 
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(17, 153, 142, 0.3);
}
.btn-complete:active { transform: translateY(0); }

.btn-cancel-order {
    width: 100%;
    background: white;
    border: 1px solid #f44336;
    color: #f44336;
    opacity: 0;
    animation: slideInUp 0.6s ease-out 1s forwards;
}
.btn-cancel-order:hover { 
    background: #ffebee; 
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(244, 67, 54, 0.15);
}
.btn-cancel-order:active { transform: translateY(0); }

"""

with open(r'c:\Users\Hope3\Desktop\website\styles.css', 'a', encoding='utf-8') as f:
    f.write(css_content)
