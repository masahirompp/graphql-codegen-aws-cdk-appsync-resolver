# graphql-codegen-aws-cdk-appsync-resolver

Generate aws-cdk AppSync

## Quick Start

1. install peer dependencies:

   ```sh
   $ yarn add -D graphql @graphql-codegen/cli
   ```

1. install graphql-codegen-aws-cdk-appsync-resolver

   ```sh
   $ yarn add -D graphql-codegen-aws-cdk-appsync-resolver
   ```

   note: versions

   | aws-cdk | graphql-codegen-aws-cdk-appsync-resolver |
   | ------- | ---------------------------------------- |
   | <=1.59  | <=0.3.2                                  |
   | >=1.60  | >=0.4.0                                  |

1. add codegen.yml:

   ```yaml
   schema:
     - "./schema.graphql"
   generates:
   ./AppSyncResolver.ts:
     plugins:
       - "graphql-codegen-aws-cdk-appsync-resolver"
   ```

1. Your Graphql Schema

   ```graphql
   type Item {
     id: ID!
     name: String
   }
   type PaginatedItem {
     items: [Item!]!
     nextToken: String
   }
   type Query {
     all(limit: Int, nextToken: String): PaginatedItem!
     getOne(id: ID!): Item
   }
   type Mutation {
     save(name: String!): Item
     delete(id: ID!): Item
   }
   type Schema {
     query: Query
     mutation: Mutation
   }
   ```

1. generate AppSyncResolver Templates

   ```sh
   $ yarn graphql-codegen
   ```

   generated AppSyncResolver.ts

   ```typescript
   import { CfnResolver } from "@aws-cdk/aws-appsync";
   import { Construct } from "@aws-cdk/core";

    ...

   export const createQueryAllResolver = createResolver("Query", "all");
   export const createQueryGetOneResolver = createResolver("Query", "getOne");
   export const createMutationSaveResolver = createResolver("Mutation", "save");
   export const createMutationDeleteResolver = createResolver("Mutation", "delete");
   ```

1. aws-cdk Usage Sample

   ```typescript
   // Your aws-cdk code
   import { GraphQLApi } from "@aws-cdk/aws-appsync";
   import { Construct, Stack, StackProps } from "@aws-cdk/core";
   import {
     createQueryGetUserResolver,
     createQueryListUsersResolver,
   } from "./your/path/to/generated/AppSyncResolver";

   class TestStack extends Stack {
     constructor(scope: Construct, id: string, props?: StackProps) {
       super(scope, id, props);

       const api = new GraphQLApi( ... );

       // crate GetOne Query resolver template
       createQueryGetOneResolver(
         this,
         {
           api,
           ...
         }
       );

       // crate ListUsers Query resolver template
       createQueryListUsersResolver(
         this,
         name => `Dev${name}` // name function
         {
           api,
           ...
         }
       );
     }
   }
   ```

   synthesized CloudFormation Template

   ```yml
   Resources:
     ItemsApi:
       Type: AWS::AppSync::GraphQLApi
       ...
     AppSyncResolverQueryGetUser:
       Type: AWS::AppSync::Resolver
       ...
       RequestMappingTemplate: >-
           {
             "version" : "2017-02-28",
             "operation": "Invoke",
             "type": QueryGetUser,
             ...
           }
       ResponseMappingTemplate: ...
     DevAppSyncResolverQueryListUsers:
       Type: AWS::AppSync::Resolver
       ...
       RequestMappingTemplate: >-
           {
             "version" : "2017-02-28",
             "operation": "Invoke",
             "type": QueryListUsers,
             ...
           }
       ResponseMappingTemplate: ...
    ...
   ```
