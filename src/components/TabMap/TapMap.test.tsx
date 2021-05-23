import * as React from "react";
import { shallow, mount } from "enzyme";
import { spy } from "sinon";
import * as renderer from "react-test-renderer";
import TabMap from "./TapMap";

describe("<TapMap />", () => {
  it("Should render normal mui tab", () => {
    shallow(<TabMap />);
    const tree = renderer.create(<TabMap />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Should render mui tab with close button", () => {
    shallow(<TabMap canClose={true} />);
    const tree = renderer.create(<TabMap canClose={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Should callback onClose when click on icon close", () => {
    const mockOnClick = spy();
    const wrap = mount(<TabMap canClose={true} onClose={mockOnClick} />);
    const buttonIcon = wrap.find("button").first();
    buttonIcon.simulate("click");
    expect(mockOnClick.calledOnce).toEqual(true);
  });
});
