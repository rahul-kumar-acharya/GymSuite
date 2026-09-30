from io import BytesIO
from decimal import Decimal

from django.http import FileResponse
from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer
from .providers import PaymentGatewayError, create_online_order
from apps.accounts.permissions import CanManagePayments
from apps.accounts.services import record_audit

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [CanManagePayments]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['payment_status', 'payment_method', 'member']
    search_fields = ['receipt_no', 'member__full_name', 'member__member_id_code', 'transaction_id']
    ordering_fields = ['payment_date', 'created_at', 'amount_paid']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return Payment.objects.none()
        return Payment.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        payment = serializer.save(gym=self.request.user.gym)
        record_audit(user=self.request.user, action='CREATE', entity='Payment', entity_id=payment.id, metadata={'amount': str(payment.amount_paid)})

    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        payment = self.get_object()
        try:
            order = create_online_order(payment=payment, amount=payment.due_amount)
        except PaymentGatewayError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        payment.payment_method = 'ONLINE'
        payment.save(update_fields=['payment_method'])
        return Response({'order': order, 'key_id': __import__('os').environ.get('RAZORPAY_KEY_ID')})

    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        payment = self.get_object()
        amount = Decimal(str(request.data.get('amount', payment.amount_paid)))
        available = payment.amount_paid - payment.refunded_amount
        if amount <= 0 or amount > available:
            return Response({'detail': 'Refund amount exceeds the refundable balance.'}, status=status.HTTP_400_BAD_REQUEST)
        payment.refunded_amount += amount
        payment.refund_reason = request.data.get('reason', '')
        payment.refunded_at = timezone.now()
        if payment.refunded_amount >= payment.amount_paid:
            payment.payment_status = 'REFUNDED'
        payment.save(update_fields=['refunded_amount', 'refund_reason', 'refunded_at', 'payment_status'])
        record_audit(user=request.user, action='REFUND', entity='Payment', entity_id=payment.id, metadata={'amount': str(amount), 'reason': payment.refund_reason})
        return Response(PaymentSerializer(payment).data)

    @action(detail=True, methods=['get'], url_path='receipt-pdf')
    def receipt_pdf(self, request, pk=None):
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas

        payment = self.get_object()
        buffer = BytesIO()
        document = canvas.Canvas(buffer, pagesize=A4)
        document.setTitle(f'Receipt {payment.receipt_no}')
        document.setFont('Helvetica-Bold', 18)
        document.drawString(72, 780, payment.gym.name)
        document.setFont('Helvetica', 11)
        lines = [
            f'Receipt: {payment.receipt_no}',
            f'Member: {payment.member.full_name} ({payment.member.member_id_code})',
            f'Date: {payment.payment_date}',
            f'Method: {payment.get_payment_method_display()}',
            f'Amount paid: INR {payment.amount_paid}',
            f'Total amount: INR {payment.total_amount}',
            f'Status: {payment.get_payment_status_display()}',
        ]
        for index, line in enumerate(lines):
            document.drawString(72, 740 - index * 24, line)
        document.drawString(72, 540, 'Thank you for choosing GymSuite.')
        document.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f'{payment.receipt_no}.pdf', content_type='application/pdf')
