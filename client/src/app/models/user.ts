export interface User {
    _id: number | string;
    username: string;
    password:String;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    email: string;
    city: string;
    country: string;
    intro: string;
    interests: string;
    profile_img:any;
    targetUser:string;
    sourceUser:string;
}


