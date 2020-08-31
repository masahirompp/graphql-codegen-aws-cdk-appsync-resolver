import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { TestStack } from "./TestStack";

test("CloudFormation Test", () => {
  // prepare
  const stack = new TestStack(new App(), "TestStack");

  const resources = SynthUtils.toCloudFormation(stack)["Resources"];
  const test1Key = Object.keys(resources).find((key) =>
    key.startsWith("AppSyncResolverQueryGetUser")
  )!;
  const test2Key = Object.keys(resources).find((key) =>
    key.startsWith("TestAppSyncResolverQueryListUsers")
  )!;

  // test 1
  expect(resources[test1Key]).toMatchSnapshot();

  // test 2
  expect(resources[test2Key]).toMatchSnapshot();
});
