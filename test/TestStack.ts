import { CfnDataSource, GraphQLApi } from "@aws-cdk/aws-appsync";
import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  createQueryGetUserResolver,
  createQueryListUsersResolver,
} from "./output";

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new GraphQLApi(this, "ItemsApi", {
      name: "items-api",
      schemaDefinitionFile: "./test/schema.graphql",
    });

    const dataSourceQueryGetUser = new CfnDataSource(
      this,
      "DataSourceQueryGetUser",
      {
        apiId: api.apiId,
        name: "DataSourceQueryGetUser",
        type: "AWS_LAMBDA",
        lambdaConfig: { lambdaFunctionArn: "dummy" },
      }
    );

    const dataSourceQueryListUsers = new CfnDataSource(
      this,
      "DataSourceQueryListUsers",
      {
        apiId: api.apiId,
        name: "DataSourceQueryListUsers",
        type: "AWS_LAMBDA",
        lambdaConfig: { lambdaFunctionArn: "dummy" },
      }
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
