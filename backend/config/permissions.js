// GridPulse AI – RBAC Permission Matrix
// Defines what each role can see and do in the application

export const PERMISSIONS = {
  admin: {
    pages: ['dashboard', 'assets', 'risk', 'prediction', 'maintenance', 'crew', 'admin'],
    canManageUsers: true,
    canDeleteAssets: true,
    canRunPrediction: true,
    canEditMaintenance: true,
    canViewAllAssets: true,
    canViewRiskAnalysis: true,
    canManageCrew: true,
    canViewAdminPanel: true,
    label: 'System Administrator'
  },
  department_manager: {
    pages: ['dashboard', 'assets', 'risk', 'prediction', 'maintenance', 'crew'],
    canManageUsers: false,
    canDeleteAssets: false,
    canRunPrediction: true,
    canEditMaintenance: true,
    canViewAllAssets: true,
    canViewRiskAnalysis: true,
    canManageCrew: true,
    canViewAdminPanel: false,
    label: 'Department Manager'
  },
  employee: {
    pages: ['dashboard', 'assets', 'maintenance'],
    canManageUsers: false,
    canDeleteAssets: false,
    canRunPrediction: false,
    canEditMaintenance: false,
    canViewAllAssets: false,
    canViewRiskAnalysis: false,
    canManageCrew: false,
    canViewAdminPanel: false,
    label: 'Field Employee'
  }
};

export function getPermissions(role) {
  return PERMISSIONS[role] || PERMISSIONS.employee;
}

export function hasPermission(role, permission) {
  const perms = getPermissions(role);
  return !!perms[permission];
}

export function canAccessPage(role, page) {
  const perms = getPermissions(role);
  return perms.pages.includes(page);
}
