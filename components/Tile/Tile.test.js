import React from "react";
import renderer from "react-test-renderer";
import { Tile } from "./Tile";

describe("<Tile />", () => {
  //Snapshot testing will compare the component against the last known good version of the rendered output
  //you can find the snapshots in the __snapshots__ folder -- they are outlines of the rendered code.
  //If you want to update the snapshot due to an intentional change, you will see a prompt to press `u`
  //  to update the snapshot file
  // more details: https://jestjs.io/docs/en/snapshot-testing.html
  it("matches the snapshot", () => {
    const tree = renderer.create(<Tile label="5" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("matches the snapshot when game complete", () => {
    const tree = renderer.create(<Tile gameComplete={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
