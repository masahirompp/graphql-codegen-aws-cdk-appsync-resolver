import { PluginFunction } from "@graphql-codegen/plugin-helpers";
import { RawTypesConfig } from "@graphql-codegen/visitor-plugin-common";

const pascalCase = (str: string) =>
  str.length > 1
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str.toUpperCase();

const queryTemplate = (
  operation: "Query" | "Mutation" | "Subscription",
  fieldName: string
) =>
  `export const create${operation}${pascalCase(
    fieldName
  )}Resolver = createResolver('${operation}', '${fieldName}')`;

export const plugin: PluginFunction<RawTypesConfig> = (schema) => {
  // Query
  const queryType = schema.getQueryType();
  const queries =
    queryType && queryType.astNode && queryType.astNode.fields
      ? queryType.astNode.fields.map((field) =>
          queryTemplate("Query", field.name.value)
        )
      : [];

  // Mutation
  const mutationType = schema.getMutationType();
  const mutations =
    mutationType && mutationType.astNode && mutationType.astNode.fields
      ? mutationType.astNode.fields.map((field) =>
          queryTemplate("Mutation", field.name.value)
        )
      : [];

  // Subscriptions
  const subscriptionType = schema.getSubscriptionType();
  const subscriptions =
    subscriptionType &&
    subscriptionType.astNode &&
    subscriptionType.astNode.fields
      ? subscriptionType.astNode.fields.map((field) =>
          queryTemplate("Subscription", field.name.value)
        )
      : [];

  return {
    prepend: [
      `import { CfnResolver, CfnResolverProps } from '@aws-cdk/aws-appsync';
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
`,
    ],
    content: [...queries, ...mutations, ...subscriptions].join("\n"),
  };
};
