import React from "react";
import { render } from "@testing-library/react";
import {
  IHelpInfoIconProps,
  HelpInfoIcon,
} from "../../src/app/components/formHelpers/HelpInfoIcon";

describe("<HelpInfoIcon/>", () => {
  const renderSetup = (props: IHelpInfoIconProps) => {
    return render(<HelpInfoIcon {...props} />);
  };

  it("should render default ConnectorTypeComponent ", () => {
    const props: IHelpInfoIconProps = {
      label: "my",
      description: "my",
    };
    const { container } = renderSetup(props);

    expect(
      container.getElementsByClassName("pf-c-form__group-label-help").length
    ).toBe(1);
  });
});
