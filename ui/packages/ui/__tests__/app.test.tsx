import { shallow } from "enzyme";
import React from "react";
import { PageLoader } from "../src/app/components/PageLoader";

describe('renders without crashing', () => {
  it('should render correctly ', () => {
    const component = shallow(<PageLoader />);
    expect(component).toMatchSnapshot();
  });
});