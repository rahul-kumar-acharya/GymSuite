from datetime import timedelta
from decimal import Decimal

from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.attendance.models import Attendance
from apps.gyms.models import Gym
from apps.memberships.models import MemberMembership, MembershipPlan
from apps.payments.models import Payment
from apps.members.models import Member


class MemberWorkflowTests(APITestCase):
    def setUp(self):
        self.gym = Gym.objects.create(
            name='Test Gym', phone='9999999999', email='owner@testgym.example',
            address='Test address', city='Pune', state='Maharashtra', pincode='411001',
        )
        self.owner = User.objects.create_user(
            username='owner@testgym.example', email='owner@testgym.example',
            password='strong-pass-123', role='OWNER', gym=self.gym,
        )
        self.plan = MembershipPlan.objects.create(
            gym=self.gym, name='Monthly', duration_days=30, price='1000.00',
        )
        self.client.force_authenticate(self.owner)

    def test_onboarding_is_atomic_and_creates_related_records(self):
        response = self.client.post('/api/v1/members/onboard/', {
            'full_name': 'Test Member',
            'email': 'member@testgym.example',
            'phone': '8888888888',
            'plan': self.plan.id,
        }, format='json')

        self.assertEqual(response.status_code, 201)
        member = Member.objects.get(gym=self.gym, email='member@testgym.example')
        membership = MemberMembership.objects.get(member=member)
        payment = Payment.objects.get(member=member)
        self.assertEqual(membership.end_date, membership.start_date + timedelta(days=30))
        self.assertEqual(payment.amount_paid, Decimal('1000.00'))
        self.assertEqual(payment.payment_status, 'PAID')

    def test_membership_rejects_foreign_tenant_objects(self):
        other_gym = Gym.objects.create(
            name='Other Gym', phone='7777777777', address='Other address',
            city='Mumbai', state='Maharashtra', pincode='400001',
        )
        other_member = Member.objects.create(
            gym=other_gym, member_id_code='OTHER-0001', full_name='Other Member', phone='7777777777',
        )
        other_plan = MembershipPlan.objects.create(
            gym=other_gym, name='Other Plan', duration_days=30, price='500.00',
        )
        response = self.client.post('/api/v1/memberships/assigned/', {
            'member': other_member.id,
            'plan': other_plan.id,
            'start_date': timezone.localdate().isoformat(),
            'end_date': (timezone.localdate() + timedelta(days=30)).isoformat(),
            'price_at_purchase': '500.00',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(MemberMembership.objects.filter(member=other_member).exists())

    def test_qr_token_can_be_scanned_once_for_active_member(self):
        member_user = User.objects.create_user(
            username='member@testgym.example', email='member@testgym.example',
            password='strong-pass-123', role='MEMBER', gym=self.gym,
        )
        member = Member.objects.create(
            gym=self.gym, user=member_user, member_id_code='GM-0001', full_name='QR Member', phone='8888888888',
        )
        MemberMembership.objects.create(
            gym=self.gym, member=member, plan=self.plan,
            start_date=timezone.localdate(), end_date=timezone.localdate() + timedelta(days=30),
            price_at_purchase=self.plan.price,
        )
        self.client.force_authenticate(member_user)
        token_response = self.client.get('/api/v1/attendance/qr-token/')
        self.assertEqual(token_response.status_code, 200)

        self.client.force_authenticate(self.owner)
        scan_response = self.client.post('/api/v1/attendance/scan/', {'token': token_response.data['token']}, format='json')
        duplicate_response = self.client.post('/api/v1/attendance/scan/', {'token': token_response.data['token']}, format='json')
        self.assertEqual(scan_response.status_code, 201)
        self.assertEqual(duplicate_response.status_code, 200)
        self.assertEqual(Attendance.objects.filter(member=member).count(), 1)

    def test_password_change_requires_current_password_and_confirmation(self):
        response = self.client.post('/api/v1/auth/change-password/', {
            'current_password': 'wrong-password',
            'new_password': 'new-strong-pass-123',
            'confirm_password': 'new-strong-pass-123',
        }, format='json')
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/api/v1/auth/change-password/', {
            'current_password': 'strong-pass-123',
            'new_password': 'new-strong-pass-123',
            'confirm_password': 'new-strong-pass-123',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.owner.refresh_from_db()
        self.assertTrue(self.owner.check_password('new-strong-pass-123'))
