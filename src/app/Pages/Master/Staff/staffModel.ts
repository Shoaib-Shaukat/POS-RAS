export class StaffModelRequest {
    staffID: number;
    staffName: string;
    staffMobileNo: string;
    staffAddress: string;
    staffEmail: string;
    staffPassword: string;
    staffDesignation: string;
    isActive: boolean;
    outletID: number;
    OwnerID: number;
}
export class StaffModelResponse {
    staffID: number;
    staffName: string;
    staffMobileNo: string;
    staffAddress: string;
    staffEmail: string;
    staffPassword: string;
    staffDesignation: string;
    isActive: boolean;
    outletID: number;
    OwnerID: number;
}


export class GroupRequestModel {
    constructor() {
        this.AssignedGroups = [];
    }
    public staffID: number;
    public AssignedGroups: GroupRoles[];
}
export class GroupRoles {
    public GroupId: number;
    public GroupName: string;
}

export class RoleAssignModel {
    public selectedRoles: RolesRequestModel[];
    public selectedGroup: any;
}
export class RolesRequestModel {
    public RoleID: number;
    public RoleName: string = "";
    public CreatedBy: number;
    public ModifiedBy: number;
}

export class UserGroupRolesModel {
    public GroupRoleID: number;
    public UserGroupId: any;
    public UserGroup: string;
    public RoleID: any;
    public RoleName: string;
    public StaffID: any;
    public StaffName: string;
}