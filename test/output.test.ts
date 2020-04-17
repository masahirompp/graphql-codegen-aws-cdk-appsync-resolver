import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { TestStack } from "./TestStack";

test("CloudFormation Test", () => {
  // prepare
  const stack = new TestStack(new App(), "TestStack");

  // test 1
  expect(
    SynthUtils.toCloudFormation(stack)["Resources"][
      "AppSyncResolverQueryGetUser"
    ]
  ).toMatchSnapshot();

  // test 2
  expect(
    SynthUtils.toCloudFormation(stack)["Resources"][
      "TestAppSyncResolverQueryListUsers"
    ]
  ).toMatchSnapshot();
});
