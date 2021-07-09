import React from "react";
import { render, screen } from "@testing-library/react";
import {
  IFormInputComponentProps,
  FormInputComponent,
} from "../../../src/app/components/formHelpers/FormInputComponent";

const fieldMock = {};
const metaMock = {};
const helperMock = {};

jest.mock("formik", () => ({
  ...jest.requireActual("formik"),
  useField: jest.fn(() => {
    return [fieldMock, metaMock, helperMock];
  }),
}));

describe("<FormInputComponent />", () => {
  const renderSetup = (props: IFormInputComponentProps) => {
    return render(<FormInputComponent {...props} />);
  };

  it("should render FormInputComponent", () => {

    const props: IFormInputComponentProps = {
      label: "InputComp",
      infoText: "InfoText",
      fieldId: "InputComp",
      name: "InputComp",
      infoTitle: "InfoTitle",
      type: "STRING",
      isRequired: true
    };
    renderSetup(props);

    expect(screen.getByText(props.label)).toBeInTheDocument();
  });
});