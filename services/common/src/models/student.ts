import _ from 'lodash';
import { PickNullable } from '../utils';

export enum ExamStatus {
    WAITING = 'waiting',
    ONGOING = 'ongoing',
    FINISHED = 'finished',
    CANCELED = 'canceled',
    PAUSED = 'paused',
}

export type StudentInfo = {
    iin: string;
    firstName: string;
    lastName: string;
    secondName: string;
    examStart: Date;
    examEstimatedEnd: Date;
    examStatus: ExamStatus;
    testCenterId: number;
    computerId: number | null;
    avatarUrl: string;
};
export type StudentInfoKey = Pick<StudentInfo, 'iin'>;

export type TestCenterInfo = {
    id: number;
    regionId: number;
    label: string;
    cameraHostname: string;
};
export type TestCenterInfoKey = Pick<TestCenterInfo, 'id'>;
export type RegionInfo = {
    id: number;
    label: string;
};
export type RegionInfoKey = Pick<RegionInfo, 'id'>;

export type StudentInfoCreateDTO = PickNullable<StudentInfo, 'examStatus' | 'computerId'>;
export type TestCenterInfoCreateDTO = TestCenterInfo;
export type RegionInfoCreateDTO = RegionInfo;

export type StudentInfoUpdateDTO = Omit<Partial<StudentInfo>, 'iin'>;

export type StudentExamStartedDTO = Pick<StudentInfo, 'examStart' | 'examEstimatedEnd'>;
export type StudentExamPausedDTO = Record<'pauseStart' | 'pauseEstimatedEnd', Date>;

export type StudentTaskPayload = {
    cameraUrl: string;
    studentIIN: string;
};
export const isStudentTaskPayload = (obj: any): obj is StudentTaskPayload =>
    _.isString(obj?.cameraUrl) && _.isString(obj?.studentIIN);

export const isImportStudentPayload = (obj: any): obj is Pick<StudentTaskPayload, 'studentIIN'> =>
    _.isString(obj?.studentIIN);

export type StudentActiveDTO = StudentTaskPayload[];
export type GetStudentInfoDTO = Pick<StudentInfo, 'avatarUrl' | 'iin'> & {
    computerId: number | null;
    testCenterId: number;
};
export type GetStudentCameraUrlResult = {
    iin: string;
    cameraUrl: string;
};

export type FinishExamsResult = {
    updated: number;
};
