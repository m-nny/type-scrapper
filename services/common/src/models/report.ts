import { PickNonNullable, PickNullable, PickSet } from '../utils';
import { ReportViolation } from './violation';

export enum ReportResolutionStatus {
    NOT_SET = 'not_set',
    CHEATED = 'cheated',
    NOT_CHEATED = 'not_cheated',
}

export type ReportInfo = {
    id: string;
    studentIIN: string;
    studentAvatarUrl: string;
    computerId: number;
    testCenterId: number;
    createdAt: Date;
    resolvedAt: Date | null;
    resolutionStatus: ReportResolutionStatus;
    resolutionMessage: string | null;
    resolvedBy?: string | null;
    violation: ReportViolation;
    violationMessage: string;
};
export type ReportInfoKey = Pick<ReportInfo, 'id'>;
export type UnresolvedReportInfo = PickSet<
    PickSet<ReportInfo, 'resolvedAt' | 'resolutionMessage' | 'resolvedBy', null>,
    'resolutionStatus',
    ReportResolutionStatus.NOT_SET
>;
export type ResolvedReportInfo = PickNonNullable<
    ReportInfo,
    'resolvedAt' | 'resolutionStatus' | 'resolutionMessage' | 'resolvedBy'
>;

export type ReportInfoCreateDTO = PickNullable<
    ReportInfo,
    'id' | 'createdAt' | 'resolvedAt' | 'resolutionMessage' | 'resolutionStatus'
>;
export type ReportInfoUpdateDTO = Partial<Omit<ReportInfo, 'id' | 'createdAt'>>;
export type ResolveReportDTO = Pick<ResolvedReportInfo, 'resolutionStatus' | 'resolutionMessage'>;
export type GetCoupleReportsDTO = Partial<
    {
        offset: number;
        limit: number;
    } & Pick<ReportInfo, 'resolutionStatus' | 'resolvedBy'>
>;

export * from './violation';
