import os

from django.core.mail import send_mail


def send_email_notification(*, recipient, title, message):
    if not recipient:
        return {'status': 'SKIPPED', 'reason': 'missing recipient'}
    send_mail(title, message, None, [recipient], fail_silently=False)
    return {'status': 'DELIVERED', 'channel': 'EMAIL'}


def send_whatsapp_notification(*, phone, message):
    endpoint = os.environ.get('WHATSAPP_API_URL')
    token = os.environ.get('WHATSAPP_API_TOKEN')
    if not endpoint or not token:
        return {'status': 'NOT_CONFIGURED', 'channel': 'WHATSAPP'}
    import requests
    response = requests.post(endpoint, json={'to': phone, 'message': message}, headers={'Authorization': f'Bearer {token}'}, timeout=10)
    response.raise_for_status()
    return {'status': 'DELIVERED', 'channel': 'WHATSAPP'}