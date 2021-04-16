type UnknownType = '';

// cspell:disable
export type TInstagramUser = {
    biography: string;
    blocked_by_viewer: boolean;
    restricted_by_viewer: boolean;
    country_block: boolean;
    external_url: null | string;
    external_url_linkshimmed: null | string;
    edge_followed_by: TInstagramEdgeCount;
    fbid: string;
    followed_by_viewer: boolean;
    edge_follow: TInstagramEdgeCount;
    follows_viewer: boolean;
    full_name: string;
    has_ar_effects: boolean;
    has_clips: boolean;
    has_guides: boolean;
    has_channel: boolean;
    has_blocked_viewer: boolean;
    highlight_reel_count: number;
    has_requested_viewer: boolean;
    id: string;
    is_business_account: boolean;
    is_professional_account: boolean;
    is_joined_recently: boolean;
    business_category_name: null | UnknownType;
    overall_category_name: null | UnknownType;
    category_enum: null | UnknownType;
    category_name: null | string;
    is_private: boolean;
    is_verified: boolean;
    edge_mutual_followed_by: TInstagramEdge<TInstagramUsername>;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    requested_by_viewer: boolean;
    should_show_category: boolean;
    username: string;
    connected_fb_page: null | UnknownType;
    edge_felix_video_timeline: TInstagramEdge<UnknownType>;
    edge_owner_to_timeline_media: TInstagramEdge<TInstagramTimelineMedia>;
    edge_saved_media: TInstagramEdge<UnknownType>;
    edge_media_collections: TInstagramEdge<UnknownType>;
};

type TInstagramEdgeCount = {
    count: number;
};

type TInstagramPageInfo = {
    has_next_page: boolean;
    end_cursor: null | string;
};

type TInstagramEdge<E> = {
    count?: number;
    page_info?: TInstagramPageInfo;
    edges?: null | Array<{ node: E }>;
};

type TInstagramTimelineMedia = {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: TInstagramDimensions;
    display_url: string;
    edge_media_to_tagged_user: TInstagramEdge<TInstagramTaggedUser>;
    fact_check_overall_rating: null | UnknownType;
    fact_check_information: null | UnknownType;
    gating_info: null | UnknownType;
    sharing_friction_info: TInstagramSharingFrictionInfo;
    media_overlay_info: null | UnknownType;
    media_preview: string | null;
    owner: TInstagramMediaOwner;
    is_video: boolean;
    accessibility_caption: string;
    edge_media_to_caption: TInstagramEdge<TInstagramCaption>;
    edge_media_to_comment: TInstagramEdge<TInstagramComment>;
    comments_disabled: boolean;
    taken_at_timestamp: number;
    edge_liked_by: TInstagramEdgeCount;
    edge_media_preview_like: TInstagramEdgeCount;
    location: TInstagramLocation | null;
    thumbnail_src: string;
    thumbnail_resources: TInstagramThumbnail[];
    edge_sidecar_to_children?: TInstagramEdge<TInstagramSidecarChild>;
};

type TInstagramDimensions = {
    height: number;
    width: number;
};

type TInstagramTaggedUser = {
    user: {
        full_name: string;
        id: string;
        is_verified: boolean;
        profile_pic_url: string;
        username: string;
    };
    x: number;
    y: number;
};

type TInstagramMediaOwner = {
    id: string;
    username: string;
};
type TInstagramUsername = {
    username: string;
};

type TInstagramCaption = {
    text: string;
};

type TInstagramComment = {
    text: string;
};

type EdgeMediaPreviewLike = {
    count: number;
};

type TInstagramLocation = {
    id: string;
    has_public_page: boolean;
    name: string;
    slug: string;
};

type TInstagramThumbnail = {
    src: string;
    config_width: number;
    config_height: number;
};

type TInstagramSidecarChild = {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: TInstagramDimensions;
    display_url: string;
    edge_media_to_tagged_user: TInstagramEdge<TInstagramTaggedUser>;
    fact_check_overall_rating: null | UnknownType;
    fact_check_information: null | UnknownType;
    gating_info: null | UnknownType;
    sharing_friction_info: TInstagramSharingFrictionInfo;
    media_overlay_info: null | UnknownType;
    media_preview: null | string;
    owner: TInstagramMediaOwner;
    is_video: boolean;
    accessibility_caption: string;
};

type TInstagramSharingFrictionInfo = {
    should_have_sharing_friction: boolean;
    bloks_app_url: null | UnknownType;
};
