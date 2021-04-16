
export type TInstagramProfileEditParams = {
    should_show_confirmation_dialog: boolean;
    is_pending_review: boolean;
    confirmation_dialog_text: string;
    disclaimer_text: string;
};
export type TInstagramProfile = {
    first_name: string;
    last_name: string;
    email: string;
    is_email_confirmed: boolean;
    is_phone_confirmed: boolean;
    username: string;
    phone_number: string;
    gender: number;
    birthday: string;
    fb_birthday?: null;
    biography: string;
    external_url: string;
    chaining_enabled: boolean;
    presence_disabled: boolean;
    business_account: boolean;
    usertag_review_enabled: boolean;
    custom_gender: string;
    profile_edit_params?: Record<string, TInstagramProfileEditParams>;
};
