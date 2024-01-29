import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppHeader from "./AppHeader";
import { BrowserRouter } from "react-router-dom";
import React from "react";

// Mock the localStorage
const localStorageMock = {
  length: 0,
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  removeItem: jest.fn(),
};

global.localStorage = localStorageMock;

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: query === "(prefers-color-scheme: dark)", // or whatever condition you need
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});

describe("AppHeader", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    const { container } = render(
      <BrowserRouter>
        <AppHeader updateCluster={() => {}} notificationBadge={<div />} />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it("should render the logo", () => {
    const { getByAltText } = render(
      <BrowserRouter>
        <AppHeader updateCluster={() => {}} notificationBadge={<div />} />
      </BrowserRouter>
    );
    const logo = getByAltText("Debezium UI Logo");
    expect(logo).toBeTruthy();
  });

  it("should render the theme toggle group", () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <AppHeader updateCluster={() => {}} notificationBadge={<div />} />
      </BrowserRouter>
    );
    const themeToggleGroup = getByLabelText("UI Theme toggle group");
    expect(themeToggleGroup).toBeTruthy();
  });

  it("should render the light theme toggle button", () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <AppHeader updateCluster={() => {}} notificationBadge={<div />} />
      </BrowserRouter>
    );
    const lightThemeButton = getByLabelText("light_theme");
    expect(lightThemeButton).toBeTruthy();
  });

  it("should render the dark theme toggle button", () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <AppHeader updateCluster={() => {}} notificationBadge={<div />} />
      </BrowserRouter>
    );
    const darkThemeButton = getByLabelText("dark_theme");
    expect(darkThemeButton).toBeTruthy();
  });

  it("should handle theme toggle", () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <AppHeader updateCluster={() => {}} notificationBadge={<div />} />
      </BrowserRouter>
    );
    const darkThemeButton = getByTestId("dark_theme");

    fireEvent.click(darkThemeButton);

    expect(document.firstElementChild).toHaveClass("pf-v5-theme-dark");
  });
});
