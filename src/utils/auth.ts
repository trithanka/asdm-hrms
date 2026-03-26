import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type DecodedAuthToken = {
  roleId?: number | string;
  fklRoleId?: number | string;
  roleID?: number | string;
  RoleId?: number | string;
};

export const getRoleIdFromToken = (): number | null => {
  const token = Cookies.get("_auth");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedAuthToken>(token);
    const roleId = Number(
      decoded?.roleId ??
        decoded?.fklRoleId ??
        decoded?.roleID ??
        decoded?.RoleId
    );

    return Number.isFinite(roleId) ? roleId : null;
  } catch {
    return null;
  }
};
