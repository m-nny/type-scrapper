export enum ViolationType {
    PHONE = '@OBJECT/phone',
    TOO_MANY_PEOPLE = '@BIOMETRY/many_people',
    NO_FACE_FOUND = '@BIOMETRY/no_face',
    ANOTHER_PERSON = '@BIOMETRY/another_person',
    NO_AVATAR_IMAGE = '@BIOMETRY/no_avatar',
    FAKE = '@FAKE/FAKE',
}

export const violationMessages: Record<ViolationType, string> = {
    [ViolationType.PHONE]: 'Найден телефон',
    [ViolationType.TOO_MANY_PEOPLE]: 'Найдено несколько лиц',
    [ViolationType.NO_FACE_FOUND]: 'Не найдено лицо студента',
    [ViolationType.ANOTHER_PERSON]: 'Найден посторонний человек',
    [ViolationType.NO_AVATAR_IMAGE]: 'Отсутствует фото профиля',
    [ViolationType.FAKE]: '**ОПИСАНИЕ НАРУШЕНИЯ, ТОЛЬКО ДЛЯ ТЕСТА**',
};
export const getViolationMessage = (violation: ViolationType): string => violationMessages[violation];

export type ViolationBox = [left: number, top: number, right: number, bottom: number, _: number, _: number, _: number];
export type ViolationPoints = { x: number; y: number; width: number; height: number };

export type ReportViolation = {
    type: ViolationType;
    image: string;
    boxes: ViolationBox[];
};

export const makeViolationPoints = ([left, top, right, bottom]: ViolationBox): ViolationPoints => ({
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
});
