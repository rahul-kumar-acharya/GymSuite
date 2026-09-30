from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Expense
from .serializers import ExpenseSerializer
from apps.accounts.permissions import CanManagePayments

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [CanManagePayments]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'expense_date']
    search_fields = ['title', 'notes']
    ordering_fields = ['expense_date', 'amount']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return Expense.objects.none()
        return Expense.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)
