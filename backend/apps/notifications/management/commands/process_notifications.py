from django.core.management.base import BaseCommand

from apps.gyms.models import Gym
from apps.notifications.services import create_membership_expiry_notifications


class Command(BaseCommand):
    help = 'Create in-app notifications for memberships approaching expiry.'

    def add_arguments(self, parser):
        parser.add_argument('--gym-id', type=int, default=None)

    def handle(self, *args, **options):
        gym = Gym.objects.filter(id=options['gym_id']).first() if options['gym_id'] else None
        created = create_membership_expiry_notifications(gym=gym)
        self.stdout.write(self.style.SUCCESS(f'Created {created} notification(s).'))