export interface ResumeDetailModel {
    careerData: [];
    msg: string;
    projectData: [];
    resumeData: ResumeData[];
    userData: UserData;
}

export interface ResumeData {
    userId: number;
    intro?: string;
    resumeName: string;
    position?: string;
    updatedAt: string;
    resumeId: number;
}

export interface UserData {
    avaterUrl?: string;
    created: string;
    email: string;
    id: number;
    phoneNumber: string;
    username: string;
}