import { CfnResolver, CfnResolverProps } from '@aws-cdk/aws-appsync';
import { Construct } from '@aws-cdk/core';

const pascalCase = (str: string) => str.length > 1 ? str.charAt(0).toUpperCase() + str.slice(1) : str.toUpperCase();

export type NameFunction = (defaultName: string) => string;
export type ResolverProps = Omit<CfnResolverProps, "typeName" | "fieldName">;

const createResolver = (typeName: string, fieldName: string) => (
  scope: Construct,
  nameOrProps: string | NameFunction | ResolverProps,
  props?: ResolverProps
) => {
  let name = "AppSyncResolver" + typeName + pascalCase(fieldName);
  let restProps: ResolverProps;

  if (typeof nameOrProps === "string") {
    name = nameOrProps;
    restProps = props!;
  } else if (typeof nameOrProps === "function") {
    name = nameOrProps(name);
    restProps = props!;
  } else {
    restProps = nameOrProps;
  }
  return new CfnResolver(scope, name, {
    typeName,
    fieldName,
    ...restProps,
  });
};

export const createQueryGetUserResolver = createResolver('Query', 'getUser')
export const createQueryListUsersResolver = createResolver('Query', 'listUsers')
export const createQueryGetConvoResolver = createResolver('Query', 'getConvo')
export const createMutationCreateUserResolver = createResolver('Mutation', 'createUser')
export const createMutationUpdateUserResolver = createResolver('Mutation', 'updateUser')
export const createMutationDeleteUserResolver = createResolver('Mutation', 'deleteUser')
export const createMutationCreateConvoResolver = createResolver('Mutation', 'createConvo')
export const createMutationCreateMessageResolver = createResolver('Mutation', 'createMessage')
export const createMutationUpdateMessageResolver = createResolver('Mutation', 'updateMessage')
export const createMutationDeleteMessageResolver = createResolver('Mutation', 'deleteMessage')
export const createMutationCreateConvoLinkResolver = createResolver('Mutation', 'createConvoLink')
export const createMutationUpdateConvoLinkResolver = createResolver('Mutation', 'updateConvoLink')
export const createSubscriptionOnCreateConvoLinkResolver = createResolver('Subscription', 'onCreateConvoLink')
export const createSubscriptionOnCreateMessageResolver = createResolver('Subscription', 'onCreateMessage')
export const createSubscriptionOnCreateUserResolver = createResolver('Subscription', 'onCreateUser')
export const createSubscriptionOnUpdateUserResolver = createResolver('Subscription', 'onUpdateUser')
export const createSubscriptionOnDeleteUserResolver = createResolver('Subscription', 'onDeleteUser')