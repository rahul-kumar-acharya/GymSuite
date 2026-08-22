from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta

from apps.members.models import Member
from apps.memberships.models import MemberMembership, MembershipPlan
from apps.attendance.models import Attendance
from apps.payments.models import Payment
from apps.expenses.models import Expense

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        gym = user.gym
        if not gym:
            return Response({'error': 'No gym context associated with this user.'}, status=status.HTTP_400_BAD_REQUEST)

        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)

        # Member counts
        total_members = Member.objects.filter(gym=gym).count()
        active_memberships = MemberMembership.objects.filter(gym=gym, status='ACTIVE', end_date__gte=today).count()
        expiring_soon = MemberMembership.objects.filter(
            gym=gym,
            end_date__gte=today,
            end_date__lte=today + timedelta(days=7)
        ).count()
        expired_members = Member.objects.filter(gym=gym, status='EXPIRED').count()

        # Attendance today
        attendance_today = Attendance.objects.filter(gym=gym, date=today).count()

        # Monthly Revenue & Expenses
        monthly_payments = Payment.objects.filter(gym=gym, payment_date__gte=first_day_of_month)
        monthly_revenue = monthly_payments.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0.00

        pending_payments = Payment.objects.filter(gym=gym, payment_status__in=['PENDING', 'PARTIAL'])
        total_pending_amount = sum(p.due_amount for p in pending_payments)

        monthly_expenses = Expense.objects.filter(gym=gym, expense_date__gte=first_day_of_month).aggregate(Sum('amount'))['amount__sum'] or 0.00
        net_profit = float(monthly_revenue) - float(monthly_expenses)

        # Recent activities
        recent_payments = Payment.objects.filter(gym=gym)[:5]
        recent_payments_data = [
            {
                'id': p.id,
                'receipt_no': p.receipt_no,
                'member_name': p.member.full_name,
                'amount_paid': str(p.amount_paid),
                'payment_method': p.get_payment_method_display(),
                'payment_date': p.payment_date,
            } for p in recent_payments
        ]

        recent_checkins = Attendance.objects.filter(gym=gym, date=today)[:5]
        recent_checkins_data = [
            {
                'id': a.id,
                'member_name': a.member.full_name,
                'check_in': a.check_in.strftime("%H:%M"),
                'method': a.get_method_display()
            } for a in recent_checkins
        ]

        # Trial information
        days_left_in_trial = gym.days_left_in_trial if hasattr(gym, 'days_left_in_trial') else 30

        return Response({
            'gym_name': gym.name,
            'status': gym.status,
            'days_left_in_trial': days_left_in_trial,
            'overview': {
                'total_members': total_members,
                'active_members': active_memberships,
                'expiring_soon': expiring_soon,
                'expired_members': expired_members,
                'attendance_today': attendance_today,
                'monthly_revenue': str(monthly_revenue),
                'monthly_expenses': str(monthly_expenses),
                'net_profit': str(net_profit),
                'total_pending_due': str(total_pending_amount)
            },
            'recent_payments': recent_payments_data,
            'recent_checkins': recent_checkins_data
        })
