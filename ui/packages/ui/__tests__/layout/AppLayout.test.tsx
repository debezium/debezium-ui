import React from "react";
import { render } from "@testing-library/react";
import { AppLayout } from "../../src/app/layout/AppLayout";

describe("<AppLayout/>", () => {
  

  it("should render AppLayout with expected spinner size", () => {
    const children = <div>page content</div>
    const { container } = render(<AppLayout>{children}</AppLayout>);

    
    expect(container.getElementsByClassName("app-page").length).toBe(1);
  });
});
