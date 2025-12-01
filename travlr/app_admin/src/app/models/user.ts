// This class should only need to track email and name attributes.

export class User {
    fName: string;
    lName: string;
    email: string;
    isRegistered: Boolean;
    isAdmin: Boolean;
    userSince: Date;


    constructor(){
        this.fName = '';
        this.lName = '';
        this.email = '';
        this.isRegistered = false;
        this.isAdmin = false;
        this.userSince = new Date();
    }
}
