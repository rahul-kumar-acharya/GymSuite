from datetime import timedelta

from django.utils import timezone

from apps.memberships.models import MemberMembership

from .models import Notification


def create_notification(*, gym, user, title, message, notification_type='SYSTEM', dedupe_key=None):
    if dedupe_key:
        existing = Notification.objects.filter(gym=gym, user=user, dedupe_key=dedupe_key).first()
        if existing:
            return existing, False
    return Notification.objects.create(
        gym=gym,
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        dedupe_key=dedupe_key,
        delivery_status='DELIVERED',
    ), True


def create_membership_expiry_notifications(*, gym=None):
    today = timezone.localdate()
    queryset = MemberMembership.objects.select_related('gym', 'member', 'member__user').filter(
        end_date__in=[today + timedelta(days=30), today + timedelta(days=7), today + timedelta(days=1)]
    )
    if gym:
        queryset = queryset.filter(gym=gym)

    created = 0
    for membership in queryset:
        days = (membership.end_date - today).days
        recipients = list(membership.gym.users.filter(role__in=['OWNER', 'MANAGER']))
        if membership.member.user_id:
            recipients.append(membership.member.user)
        for user in filter(None, recipients):
            _, was_created = create_notification(
                gym=membership.gym,
                user=user,
                title='Membership renewal due',
                message=f'{membership.member.full_name} membership expires in {days} day(s).',
                notification_type='MEMBERSHIP_EXPIRING',
                dedupe_key=f'membership:{membership.id}:expiry:{membership.end_date}:{user.id}',
            )
            created += int(was_created)
    return created