from .models import AuditLog


def record_audit(*, user, action, entity, entity_id=None, metadata=None):
    return AuditLog.objects.create(
        gym=getattr(user, 'gym', None),
        user=user,
        action=action,
        entity=entity,
        entity_id=str(entity_id) if entity_id is not None else None,
        metadata=metadata or {},
    )
