import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.gyms.models import Gym
from apps.subscriptions.models import SaaSPlan, GymSubscription
from apps.members.models import Member
from apps.memberships.models import MembershipPlan, MemberMembership
from apps.payments.models import Payment
from apps.attendance.models import Attendance
from apps.trainers.models import TrainerProfile
from apps.workouts.models import WorkoutPlan, WorkoutDay, WorkoutExercise
from apps.expenses.models import Expense
from apps.notifications.models import Notification
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

def seed():
    print("[+] Seeding GymSuite initial database...")

    # 1. SaaS Tiers
    starter, _ = SaaSPlan.objects.get_or_create(
        slug='starter',
        defaults={
            'name': 'Starter',
            'price_monthly': 499.00,
            'max_members': 100,
            'description': 'Ideal for small neighborhood gyms and personal training studios.'
        }
    )

    pro, _ = SaaSPlan.objects.get_or_create(
        slug='professional',
        defaults={
            'name': 'Professional',
            'price_monthly': 999.00,
            'max_members': 500,
            'description': 'For growing gyms requiring attendance tracking, payment receipts, and trainer management.'
        }
    )

    premium, _ = SaaSPlan.objects.get_or_create(
        slug='premium',
        defaults={
            'name': 'Premium',
            'price_monthly': 1499.00,
            'max_members': -1,
            'description': 'For high-volume fitness chains requiring white-label reports, multi-branch, and priority support.'
        }
    )

    # 2. Demo Gym
    gym, _ = Gym.objects.get_or_create(
        name='Hercules Health Club',
        defaults={
            'phone': '+91 98765 43210',
            'email': 'owner@herculesgym.com',
            'address': 'Plot 42, MG Road, Indiranagar',
            'city': 'Bengaluru',
            'state': 'Karnataka',
            'pincode': '560038',
            'code_prefix': 'HERCULES',
            'status': 'TRIAL',
            'trial_ends_at': timezone.now() + timedelta(days=30)
        }
    )

    GymSubscription.objects.get_or_create(
        gym=gym,
        defaults={'plan': pro, 'status': 'TRIAL'}
    )

    # 3. Demo Owner Account
    owner, created_owner = User.objects.get_or_create(
        username='owner@herculesgym.com',
        defaults={
            'email': 'owner@herculesgym.com',
            'first_name': 'Vikram',
            'last_name': 'Rathore',
            'role': 'OWNER',
            'gym': gym,
            'phone': '+91 98765 43210'
        }
    )
    if created_owner:
        owner.set_password('gymsuite123')
        owner.save()

    # 4. Demo Staff Account
    staff, created_staff = User.objects.get_or_create(
        username='staff@herculesgym.com',
        defaults={
            'email': 'staff@herculesgym.com',
            'first_name': 'Neha',
            'last_name': 'Sharma',
            'role': 'STAFF',
            'gym': gym,
            'phone': '+91 98765 43211'
        }
    )
    if created_staff:
        staff.set_password('gymsuite123')
        staff.save()

    # 5. Demo Trainer Account
    trainer_user, created_trainer = User.objects.get_or_create(
        username='trainer@herculesgym.com',
        defaults={
            'email': 'trainer@herculesgym.com',
            'first_name': 'Rajesh',
            'last_name': 'Kumar',
            'role': 'TRAINER',
            'gym': gym,
            'phone': '+91 98765 43212'
        }
    )
    if created_trainer:
        trainer_user.set_password('gymsuite123')
        trainer_user.save()

    trainer_prof, _ = TrainerProfile.objects.get_or_create(
        gym=gym,
        user=trainer_user,
        defaults={
            'specialization': 'Strength Training & Functional Fitness',
            'bio': 'Certified Fitness Coach with 8+ years experience in muscle hypertrophy and rehab.',
            'salary_monthly': 25000.00
        }
    )

    # 6. Membership Plans
    plan_monthly, _ = MembershipPlan.objects.get_or_create(
        gym=gym,
        name='Monthly Access',
        defaults={'duration_days': 30, 'price': 1500.00, 'description': 'Full gym access for 30 days.'}
    )

    plan_quarterly, _ = MembershipPlan.objects.get_or_create(
        gym=gym,
        name='Quarterly Transformation',
        defaults={'duration_days': 90, 'price': 4000.00, 'description': '3 months access with diet consultation.'}
    )

    plan_yearly, _ = MembershipPlan.objects.get_or_create(
        gym=gym,
        name='Annual Gold Membership',
        defaults={'duration_days': 365, 'price': 12000.00, 'description': '1 year unlimited access + free locker.'}
    )

    # 7. Demo Members
    members_data = [
        ('Amit Verma', 'amit@gmail.com', '+91 91234 56789', 'MALE', plan_quarterly),
        ('Priya Patel', 'priya@gmail.com', '+91 92345 67890', 'FEMALE', plan_monthly),
        ('Rahul Roy', 'rahul@gmail.com', '+91 93456 78901', 'MALE', plan_yearly),
        ('Siddharth Malhotra', 'sid@gmail.com', '+91 94567 89012', 'MALE', plan_monthly),
        ('Ananya Sen', 'ananya@gmail.com', '+91 95678 90123', 'FEMALE', plan_quarterly),
    ]

    for name, email, phone, gender, plan in members_data:
        m_user, m_u_created = User.objects.get_or_create(
            username=email,
            defaults={
                'email': email,
                'first_name': name.split()[0],
                'last_name': name.split()[1] if len(name.split()) > 1 else '',
                'role': 'MEMBER',
                'gym': gym,
                'phone': phone
            }
        )
        if m_u_created:
            m_user.set_password('gymsuite123')
            m_user.save()

        member, _ = Member.objects.get_or_create(
            gym=gym,
            email=email,
            defaults={
                'user': m_user,
                'full_name': name,
                'phone': phone,
                'gender': gender,
                'status': 'ACTIVE'
            }
        )

        # Assign Membership
        m_membership, _ = MemberMembership.objects.get_or_create(
            gym=gym,
            member=member,
            plan=plan,
            defaults={
                'start_date': timezone.now().date() - timedelta(days=5),
                'end_date': timezone.now().date() + timedelta(days=plan.duration_days - 5),
                'price_at_purchase': plan.price,
                'status': 'ACTIVE'
            }
        )

        # Payment
        Payment.objects.get_or_create(
            gym=gym,
            member=member,
            member_membership=m_membership,
            defaults={
                'amount_paid': plan.price,
                'total_amount': plan.price,
                'payment_status': 'PAID',
                'payment_method': 'UPI',
                'transaction_id': f'UPI{timezone.now().timestamp():.0f}',
                'payment_date': timezone.now().date() - timedelta(days=5)
            }
        )

        # Today Checkin
        Attendance.objects.get_or_create(
            gym=gym,
            member=member,
            date=timezone.now().date(),
            defaults={'check_in': timezone.now().time(), 'method': 'MANUAL'}
        )

    # 8. Demo Workout Plan
    wpt, _ = WorkoutPlan.objects.get_or_create(
        gym=gym,
        title='4-Day Muscle Hypertrophy',
        defaults={'description': 'Progressive overload split focused on compound movements.', 'created_by': owner}
    )
    wpt.assigned_members.set(Member.objects.filter(gym=gym))

    day1, _ = WorkoutDay.objects.get_or_create(workout_plan=wpt, day_name='Day 1 - Chest & Triceps', defaults={'order': 1})
    WorkoutExercise.objects.get_or_create(workout_day=day1, exercise_name='Flat Barbell Bench Press', defaults={'sets': 4, 'reps': '10-12', 'rest_seconds': 90})
    WorkoutExercise.objects.get_or_create(workout_day=day1, exercise_name='Incline Dumbbell Press', defaults={'sets': 3, 'reps': '12', 'rest_seconds': 60})

    # 9. Expenses
    Expense.objects.get_or_create(
        gym=gym,
        title='Gym Floor Rent - August',
        defaults={'category': 'RENT', 'amount': 35000.00, 'expense_date': timezone.now().date().replace(day=1)}
    )
    Expense.objects.get_or_create(
        gym=gym,
        title='AC & Electricity Bill',
        defaults={'category': 'ELECTRICITY', 'amount': 12500.00, 'expense_date': timezone.now().date().replace(day=5)}
    )

    # 10. Notification
    Notification.objects.get_or_create(
        gym=gym,
        title='Welcome to GymSuite!',
        defaults={'message': 'Your 30-day trial is active for Hercules Health Club.', 'notification_type': 'TRIAL_ALERT'}
    )

    print("SUCCESS: Database seeding complete!")
    print("--------------------------------------------------")
    print("DEMO OWNER CREDENTIALS:")
    print("  Email: owner@herculesgym.com")
    print("  Password: gymsuite123")
    print("DEMO MEMBER CREDENTIALS:")
    print("  Email: amit@gmail.com")
    print("  Password: gymsuite123")
    print("--------------------------------------------------")

if __name__ == '__main__':
    seed()
