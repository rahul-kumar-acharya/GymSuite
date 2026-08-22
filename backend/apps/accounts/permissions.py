from rest_framework import permissions

class IsSuperAdminUser(permissions.BasePermission):
    """
    Allows access only to Super Admin users (role == 'SUPERADMIN' or is_superuser).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'SUPERADMIN' or request.user.is_superuser))
