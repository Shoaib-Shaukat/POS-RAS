export class registerModelRequest {
    constructor() {
        this.ownerId = 0;
        this.Name = "";
        this.Email = "";
        this.DOB = "";
        this.Cnic = "";
        this.MobileNo = "";
        this.Gender = "";
        this.Address = "";
        this.Password = "";
        this.isActive = false;
        this.Designation = "";
    }

    ownerId: number;
    Name: string;
    Email: string;
    DOB: string;
    Cnic: string;
    MobileNo: string;
    Gender: string;
    Address: string;
    Password: string;
    isActive: boolean
    Designation: string;
}

export class registerModelResponse {
    constructor() {
        this.ownerId = 0;
        this.name = "";
        this.email = "";
        this.dob = "";
        this.cnic = "";
        this.mobileNo = "";
        this.gender = "";
        this.address = "";
        this.password = "";
        this.isActive = false;
        this.Designation = "";
    }

    ownerId: number;
    name: string;
    email: string;
    dob: string;
    cnic: string;
    mobileNo: string;
    gender: string;
    address: string;
    password: string;
    isActive: boolean;
    Designation: string;
}