import { CfnDataSource, CfnGraphQLApi } from "@aws-cdk/aws-appsync";
import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  createQueryGetUserResolver,
  createQueryListUsersResolver,
} from "./output";

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new CfnGraphQLApi(this, "ItemsApi", {
      name: "items-api",
      authenticationType: "AMAZON_COGNITO_USER_POOLS",
    });

    const dataSourceQueryGetUser = new CfnDataSource(
      this,
      "DataSourceQueryGetUser",
      {
        apiId: api.attrApiId,
        name: "DataSourceQueryGetUser",
        type: "AWS_LAMBDA",
        lambdaConfig: { lambdaFunctionArn: "dummy" },
      }
    );

    const dataSourceQueryListUsers = new CfnDataSource(
      this,
      "DataSourceQueryListUsers",
      {
        apiId: api.attrApiId,
        name: "DataSourceQueryListUsers",
        type: "AWS_LAMBDA",
        lambdaConfig: { lambdaFunctionArn: "dummy" },
      }
    );

    // test 1
    createQueryGetUserResolver(this, {
      apiId: api.attrApiId,
      dataSourceName: dataSourceQueryGetUser.name,
    });

    // test 2
    createQueryListUsersResolver(this, (name) => `Test${name}`, {
      apiId: api.attrApiId,
      dataSourceName: dataSourceQueryListUsers.name,
    });
  }
}

const app = new App();
new TestStack(app, "TestStack");
app.synth();
