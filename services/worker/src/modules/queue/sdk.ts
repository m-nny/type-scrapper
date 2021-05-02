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

export type EnqueueImportDataInput = {
  count?: Maybe<Scalars['Float']>;
};

export type ImportInstagramUserDataInput = {
  username: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
};

export type Mutation = {
  enqueueImport: Scalars['ID'];
  importUser: Scalars['ID'];
};


export type MutationEnqueueImportArgs = {
  data: EnqueueImportDataInput;
  jobName: Scalars['String'];
};


export type MutationImportUserArgs = {
  data: ImportInstagramUserDataInput;
  jobName: Scalars['String'];
};

export type Query = {
  zero2: Scalars['Int'];
  zero: Scalars['Int'];
};

export type AddImportUserJobMutationVariables = Exact<{
  jobName?: Maybe<Scalars['String']>;
  jobData: ImportInstagramUserDataInput;
}>;


export type AddImportUserJobMutation = Pick<Mutation, 'importUser'>;


export const AddImportUserJobDocument = gql`
    mutation addImportUserJob($jobName: String = "getUserProfile", $jobData: ImportInstagramUserDataInput!) {
  importUser(jobName: $jobName, data: $jobData)
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addImportUserJob(variables: AddImportUserJobMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddImportUserJobMutation> {
      return withWrapper(() => client.request<AddImportUserJobMutation>(AddImportUserJobDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;