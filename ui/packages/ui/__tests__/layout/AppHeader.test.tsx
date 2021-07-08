import React from "react";
import { render } from "@testing-library/react";
import { AppHeader, IAppHeader } from "../../src/app/layout/AppHeader";

describe("<AppHeader/>", () => {
  
  const renderSetup = (props: IAppHeader) => {
    return render(<AppHeader {...props} />);
  };

  it("should render AppHeader ", () => {
    const handleClusterChangeMock = jest.fn()

    const props: IAppHeader = {
      handleClusterChange: handleClusterChangeMock,
    };
    const { container } = renderSetup(props);

    expect(container.getElementsByClassName("brandLogo").length).toBe(
      1
    );
  });
});
