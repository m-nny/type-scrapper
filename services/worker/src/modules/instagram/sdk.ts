import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type InstagramFollower = {
  id: Scalars['String'];
  username: Scalars['String'];
  full_name: Scalars['String'];
  profile_pic_url: Scalars['String'];
  is_verified: Scalars['Boolean'];
  followed_by_viewer: Scalars['Boolean'];
  requested_by_viewer: Scalars['Boolean'];
};

export type InstagramFollowers = {
  count: Scalars['Float'];
  page_info: InstagramPageInfo;
  data: Array<InstagramFollower>;
  data_length: Scalars['Int'];
};

export type InstagramFollowings = {
  count: Scalars['Float'];
  page_info: InstagramPageInfo;
  data: Array<InstagramFollower>;
  data_length: Scalars['Int'];
};

export type InstagramPageInfo = {
  has_next_page: Scalars['Boolean'];
  end_cursor?: Maybe<Scalars['String']>;
};

export type InstagramPaginationArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
};

export type InstagramProfile = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  is_email_confirmed: Scalars['Boolean'];
  is_phone_confirmed: Scalars['Boolean'];
  username: Scalars['String'];
  phone_number: Scalars['String'];
  gender: Scalars['Float'];
  birthday: Scalars['String'];
  biography: Scalars['String'];
  external_url: Scalars['String'];
  chaining_enabled: Scalars['Boolean'];
  presence_disabled: Scalars['Boolean'];
  business_account: Scalars['Boolean'];
  usertag_review_enabled: Scalars['Boolean'];
  custom_gender: Scalars['String'];
};

export type InstagramUser = {
  biography: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
  profile_pic_url: Scalars['String'];
  profile_pic_url_hd: Scalars['String'];
  followers: InstagramFollowers;
  followings: InstagramFollowings;
};


export type InstagramUserFollowersArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
};


export type InstagramUserFollowingsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
};

export type Query = {
  myProfile: InstagramProfile;
  user: InstagramUser;
  followersById: InstagramFollowers;
  followingsById: InstagramFollowings;
};


export type QueryUserArgs = {
  username: Scalars['String'];
};


export type QueryFollowersByIdArgs = {
  page: InstagramPaginationArgs;
  userId: Scalars['String'];
};


export type QueryFollowingsByIdArgs = {
  page: InstagramPaginationArgs;
  userId: Scalars['String'];
};

export type GetFollowersQueryVariables = Exact<{
  username: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetFollowersQuery = { user: { followers: (
      Pick<InstagramFollowers, 'count'>
      & { page_info: Pick<InstagramPageInfo, 'has_next_page' | 'end_cursor'>, data: Array<Pick<InstagramFollower, 'username'>> }
    ) } };

export type GetFollowersByIdQueryVariables = Exact<{
  userId: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetFollowersByIdQuery = { followersById: (
    Pick<InstagramFollowers, 'count'>
    & { page_info: Pick<InstagramPageInfo, 'has_next_page' | 'end_cursor'>, data: Array<Pick<InstagramFollower, 'username'>> }
  ) };

export type GetFollowingsQueryVariables = Exact<{
  username: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetFollowingsQuery = { user: { followings: (
      Pick<InstagramFollowings, 'count'>
      & { page_info: Pick<InstagramPageInfo, 'has_next_page' | 'end_cursor'>, data: Array<Pick<InstagramFollower, 'username'>> }
    ) } };

export type GetFollowingsByIdQueryVariables = Exact<{
  userId: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetFollowingsByIdQuery = { followingsById: (
    Pick<InstagramFollowings, 'count'>
    & { page_info: Pick<InstagramPageInfo, 'has_next_page' | 'end_cursor'>, data: Array<Pick<InstagramFollower, 'username'>> }
  ) };

export type GetProfileQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetProfileQuery = { user: (
    Pick<InstagramUser, 'id' | 'username'>
    & { avatarUrl: InstagramUser['profile_pic_url_hd'] }
  ) };


export const GetFollowersDocument = gql`
    query getFollowers($username: String!, $cursor: String) {
  user(username: $username) {
    followers(first: 50, after: $cursor) {
      count
      page_info {
        has_next_page
        end_cursor
      }
      data {
        username
      }
    }
  }
}
    `;
export const GetFollowersByIdDocument = gql`
    query getFollowersById($userId: String!, $cursor: String) {
  followersById(userId: $userId, page: {first: 50, after: $cursor}) {
    count
    page_info {
      has_next_page
      end_cursor
    }
    data {
      username
    }
  }
}
    `;
export const GetFollowingsDocument = gql`
    query getFollowings($username: String!, $cursor: String) {
  user(username: $username) {
    followings(first: 50, after: $cursor) {
      count
      page_info {
        has_next_page
        end_cursor
      }
      data {
        username
      }
    }
  }
}
    `;
export const GetFollowingsByIdDocument = gql`
    query getFollowingsById($userId: String!, $cursor: String) {
  followingsById(userId: $userId, page: {first: 50, after: $cursor}) {
    count
    page_info {
      has_next_page
      end_cursor
    }
    data {
      username
    }
  }
}
    `;
export const GetProfileDocument = gql`
    query getProfile($username: String!) {
  user(username: $username) {
    id
    username
    avatarUrl: profile_pic_url_hd
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getFollowers(variables: GetFollowersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFollowersQuery> {
      return withWrapper(() => client.request<GetFollowersQuery>(GetFollowersDocument, variables, requestHeaders));
    },
    getFollowersById(variables: GetFollowersByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFollowersByIdQuery> {
      return withWrapper(() => client.request<GetFollowersByIdQuery>(GetFollowersByIdDocument, variables, requestHeaders));
    },
    getFollowings(variables: GetFollowingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFollowingsQuery> {
      return withWrapper(() => client.request<GetFollowingsQuery>(GetFollowingsDocument, variables, requestHeaders));
    },
    getFollowingsById(variables: GetFollowingsByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFollowingsByIdQuery> {
      return withWrapper(() => client.request<GetFollowingsByIdQuery>(GetFollowingsByIdDocument, variables, requestHeaders));
    },
    getProfile(variables: GetProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProfileQuery> {
      return withWrapper(() => client.request<GetProfileQuery>(GetProfileDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;