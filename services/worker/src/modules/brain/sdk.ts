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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};


export type InstagramImage = {
  id: Scalars['String'];
  url: Scalars['String'];
  author: InstagramUser;
};

export type InstagramUser = {
  username: Scalars['ID'];
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<InstagramUserInfo>;
  images: Array<InstagramImage>;
  follows: Array<InstagramUserFollow>;
  followedBy: Array<InstagramUserFollow>;
};

export type InstagramUserFollow = {
  followerUsername: Scalars['ID'];
  followeeUsername: Scalars['ID'];
  follower: InstagramUser;
  followee: InstagramUser;
};

export type InstagramUserFollowList = {
  askedPage: ListPage;
  items: Array<InstagramUserFollow>;
  totalCount: Scalars['Float'];
};

export type InstagramUserInfo = {
  id: Scalars['ID'];
  avatarUrl: Scalars['String'];
  importDate: Scalars['DateTime'];
};

export type InstagramUserInfoInput = {
  id: Scalars['String'];
  avatarUrl: Scalars['String'];
};

export type InstagramUserInput = {
  username: Scalars['String'];
  info?: Maybe<InstagramUserInfoInput>;
};

export type InstagramUserList = {
  askedPage: ListPage;
  items: Array<InstagramUser>;
  totalCount: Scalars['Float'];
};

export type ListPage = {
  skip: Scalars['Int'];
  take: Scalars['Int'];
};

export type ListPageArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  instagramUserFollowedBy: Scalars['Int'];
  instagramUserFollowing: Scalars['Int'];
  createInstagramUser: InstagramUser;
  addRecipe: Recipe;
};


export type MutationInstagramUserFollowedByArgs = {
  username: Scalars['String'];
  create?: Maybe<Scalars['Boolean']>;
  followedBy: Array<Scalars['String']>;
};


export type MutationInstagramUserFollowingArgs = {
  username: Scalars['String'];
  create?: Maybe<Scalars['Boolean']>;
  following: Array<Scalars['String']>;
};


export type MutationCreateInstagramUserArgs = {
  data: InstagramUserInput;
};


export type MutationAddRecipeArgs = {
  newRecipeData: NewRecipeInput;
};

export type NewRecipeInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  ingredients: Array<Scalars['String']>;
};

export type Query = {
  instagramFollows: InstagramUserFollowList;
  instagramUser: InstagramUser;
  instagramUsers: InstagramUserList;
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryInstagramFollowsArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type QueryInstagramUserArgs = {
  username: Scalars['String'];
};


export type QueryInstagramUsersArgs = {
  onlyNotImported?: Maybe<Scalars['Boolean']>;
  page?: Maybe<ListPageArgs>;
};


export type QueryRecipeArgs = {
  id: Scalars['ID'];
};


export type QueryRecipesArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export type Recipe = {
  id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  creationDate: Scalars['DateTime'];
  ingredients: Array<Scalars['String']>;
};

export type AddInstagramUserFollowedByMutationVariables = Exact<{
  username: Scalars['String'];
  followedBy: Array<Scalars['String']> | Scalars['String'];
}>;


export type AddInstagramUserFollowedByMutation = Pick<Mutation, 'instagramUserFollowedBy'>;

export type AddInstagramUserIsFollowingMutationVariables = Exact<{
  username: Scalars['String'];
  following: Array<Scalars['String']> | Scalars['String'];
}>;


export type AddInstagramUserIsFollowingMutation = Pick<Mutation, 'instagramUserFollowing'>;

export type CreateInstagramUserMutationVariables = Exact<{
  user: InstagramUserInput;
}>;


export type CreateInstagramUserMutation = { createInstagramUser: Pick<InstagramUser, 'username'> };


export const AddInstagramUserFollowedByDocument = gql`
    mutation addInstagramUserFollowedBy($username: String!, $followedBy: [String!]!) {
  instagramUserFollowedBy(
    followedBy: $followedBy
    username: $username
    create: true
  )
}
    `;
export const AddInstagramUserIsFollowingDocument = gql`
    mutation addInstagramUserIsFollowing($username: String!, $following: [String!]!) {
  instagramUserFollowing(following: $following, username: $username, create: true)
}
    `;
export const CreateInstagramUserDocument = gql`
    mutation createInstagramUser($user: InstagramUserInput!) {
  createInstagramUser(data: $user) {
    username
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addInstagramUserFollowedBy(variables: AddInstagramUserFollowedByMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddInstagramUserFollowedByMutation> {
      return withWrapper(() => client.request<AddInstagramUserFollowedByMutation>(AddInstagramUserFollowedByDocument, variables, requestHeaders));
    },
    addInstagramUserIsFollowing(variables: AddInstagramUserIsFollowingMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddInstagramUserIsFollowingMutation> {
      return withWrapper(() => client.request<AddInstagramUserIsFollowingMutation>(AddInstagramUserIsFollowingDocument, variables, requestHeaders));
    },
    createInstagramUser(variables: CreateInstagramUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateInstagramUserMutation> {
      return withWrapper(() => client.request<CreateInstagramUserMutation>(CreateInstagramUserDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;