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
  id: Scalars['ID'];
  avatarUrl: Scalars['String'];
  importDate: Scalars['DateTime'];
  images: Array<InstagramImage>;
};

export type InstagramUserInput = {
  id: Scalars['String'];
  username: Scalars['String'];
  avatarUrl: Scalars['String'];
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

export type Mutation = {
  createInstagramUser: InstagramUser;
  addRecipe: Recipe;
};


export type MutationCreateInstagramUserArgs = {
  newItem: InstagramUserInput;
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
  instagramUser: InstagramUser;
  instagramUsers: InstagramUserList;
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryInstagramUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
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

export type CreateInstagramUserMutationVariables = Exact<{
  user: InstagramUserInput;
}>;


export type CreateInstagramUserMutation = { createInstagramUser: Pick<InstagramUser, 'username'> };


export const CreateInstagramUserDocument = gql`
    mutation createInstagramUser($user: InstagramUserInput!) {
  createInstagramUser(newItem: $user) {
    username
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createInstagramUser(variables: CreateInstagramUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateInstagramUserMutation> {
      return withWrapper(() => client.request<CreateInstagramUserMutation>(CreateInstagramUserDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;