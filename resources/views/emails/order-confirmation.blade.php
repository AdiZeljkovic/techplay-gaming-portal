<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #0f172a;
            color: white;
            padding: 40px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border-radius: 16px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 30px;
        }

        h1 {
            color: #f8fafc;
            font-size: 24px;
            margin-bottom: 16px;
        }

        p {
            color: #94a3b8;
            line-height: 1.6;
        }

        .order-box {
            background: rgba(51, 65, 85, 0.5);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }

        .order-number {
            font-size: 18px;
            color: #10b981;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        th {
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
        }

        td {
            color: #f8fafc;
        }

        .total {
            font-size: 20px;
            color: #10b981;
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #64748b;
            font-size: 13px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">🛒 Order Confirmed!</div>
        <h1>Thank you for your order!</h1>
        <p>Your order has been received and is being processed.</p>

        <div class="order-box">
            <span class="order-number">Order #{{ $order->order_number }}</span>
            <p style="margin: 5px 0; color: #64748b;">{{ $order->created_at->format('F j, Y g:i A') }}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                    <tr>
                        <td>{{ $item->product->name ?? 'Product' }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>${{ number_format($item->price, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total">Total: ${{ number_format($order->total, 2) }}</div>

        <div class="footer">
            <p>Questions? Contact us at support@techplay.com</p>
            <p>© {{ date('Y') }} TechPlay. All rights reserved.</p>
        </div>
    </div>
</body>

</html>