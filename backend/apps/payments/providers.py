import os


class PaymentGatewayError(Exception):
    pass


def create_online_order(*, payment, amount, currency='INR'):
    key_id = os.environ.get('RAZORPAY_KEY_ID')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        raise PaymentGatewayError('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    try:
        import razorpay
    except ImportError as exc:
        raise PaymentGatewayError('Install the razorpay package to enable online payments.') from exc
    client = razorpay.Client(auth=(key_id, key_secret))
    return client.order.create({
        'amount': int(amount * 100),
        'currency': currency,
        'receipt': payment.receipt_no,
        'notes': {'payment_id': str(payment.id), 'gym_id': str(payment.gym_id)},
    })
