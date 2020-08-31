import { GraphQLApi, Schema } from "@aws-cdk/aws-appsync";
import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  createQueryGetUserResolver,
  createQueryListUsersResolver,
} from "./output";
import { Function, AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new GraphQLApi(this, "ItemsApi", {
      name: "items-api",
      schema: Schema.fromAsset("./test/schema.graphql"),
    });

    const dataSourceQueryGetUser = api.addDynamoDbDataSource(
      "DataSourceQueryGetUser",
      new Table(this, "UserTable", {
        partitionKey: { name: "userId", type: AttributeType.STRING },
      })
    );

    const dataSourceQueryListUsers = api.addLambdaDataSource(
      "DataSourceQueryListUsers",
      new Function(this, "ListUserFunction", {
        code: AssetCode.fromInline("export const handler = () => null"),
        handler: "index.handler",
        runtime: Runtime.NODEJS_12_X,
      })
    );

    // test 1
    createQueryGetUserResolver(this, {
      api,
      dataSource: dataSourceQueryGetUser,
    });

    // test 2
    createQueryListUsersResolver(this, (name) => `Test${name}`, {
      api,
      dataSource: dataSourceQueryListUsers,
    });
  }
}

const app = new App();
new TestStack(app, "TestStack");
app.synth();
