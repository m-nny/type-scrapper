import { ReportInfo } from './report';
import { UserCredential } from './userCredential';

export type ProctorInfo = Omit<UserCredential, 'password_hashed' | 'role'>;
export type ProctorReport = Pick<
    ReportInfo,
    'id' | 'studentIIN' | 'violationMessage' | 'violation' | 'resolutionStatus'
>;

export type GetProctorsDTO = ProctorInfo[];
export type GetProctorReportsDTO = ProctorReport[];
export type GetProctorReportsFilter = Partial<Pick<ProctorReport, 'resolutionStatus' | 'violationMessage'>>;

export type StudentSummary = Pick<ReportInfo, 'studentIIN'> & { totalReports: number; isBanned: boolean };
export type StudentReport = Pick<
    ReportInfo,
    'id' | 'violation' | 'createdAt' | 'violationMessage' | 'resolutionStatus'
> & {
    resolvedBy: string | null;
};
export type GetStudentSummariesDTO = StudentSummary[];
export type GetStudentReportsDTO = StudentReport[];
