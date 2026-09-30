from rest_framework import permissions

class IsSuperAdminUser(permissions.BasePermission):
    """
    Allows access only to Super Admin users (role == 'SUPERADMIN' or is_superuser).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'SUPERADMIN' or request.user.is_superuser))


class GymRolePermission(permissions.BasePermission):
    allowed_roles = set()

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or (user.gym_id and user.role in self.allowed_roles))
        )


class CanManageMembers(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF'}

class CanViewAssignedMembers(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF', 'TRAINER'}


class CanViewMemberAttendance(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF', 'TRAINER', 'MEMBER'}


class CanManageMemberships(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF'}


class CanManagePayments(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF'}


class CanManageAttendance(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF', 'TRAINER'}

class CanAccessAttendanceQr(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF', 'TRAINER', 'MEMBER'}


class CanAccessMemberSelf(GymRolePermission):
    allowed_roles = {'MEMBER', 'OWNER'}


class CanManageTrainers(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER'}


class CanManageWorkouts(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'TRAINER'}


class CanViewWorkouts(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF', 'TRAINER', 'MEMBER'}


class CanManageGymSettings(GymRolePermission):
    allowed_roles = {'OWNER'}


class CanManageStaff(GymRolePermission):
    allowed_roles = {'OWNER'}


class CanViewAuditLogs(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER'}


class CanViewGymData(GymRolePermission):
    allowed_roles = {'OWNER', 'MANAGER', 'STAFF', 'TRAINER'}
