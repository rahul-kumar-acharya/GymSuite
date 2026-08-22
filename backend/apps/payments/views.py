from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
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
        serializer.save(gym=self.request.user.gym)
