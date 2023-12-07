import {
  Brand,
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import logo from "@app/assets/images/debezium_logo.png";
import React, { useEffect, useState } from "react";
import { KafkaConnectCluster } from "@app/components";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "@patternfly/react-icons";
import "./AppHeader.css";

interface Props {
  // toggleSidebar: () => void;
  updateCluster: (cluster: string) => void;
  notificationBadge: React.ReactNode;
}

const AppHeader: React.FC<Props> = ({ updateCluster, notificationBadge }) => {
  const [themeSelected, setThemeSelected] = useState("toggle-group-sun-icon");

  const handleThemeToggle = (event: any, selected: boolean) => {
    const id = event.currentTarget.id;
    setPreference(id);
  };

  const storageKey = "theme-preference";

  useEffect(() => {
    let theme = "light";
    if (localStorage.getItem(storageKey)) {
      theme = localStorage.getItem(storageKey) || "light";
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      } else {
        theme = "light";
      }
    }
    theme === "light"
      ? setThemeSelected("toggle-group-sun-icon")
      : setThemeSelected("toggle-group-moon-icon");
    reflectPreference(theme);
  }, []);

  const setPreference = (id: string) => {
    let theme = id === "toggle-group-sun-icon" ? "light" : "dark";
    setThemeSelected(id);
    localStorage.setItem(storageKey, theme);
    reflectPreference(theme);
  };

  const reflectPreference = (theme: string) => {
    if (theme === "dark") {
      document.firstElementChild!.setAttribute("class", "pf-v5-theme-dark");
    } else {
      document.firstElementChild!.removeAttribute("class");
    }
  };

  const navigate = useNavigate();
  const takeHome = () => {
    navigate("/");
  };
  return (
    <Masthead display={{ default: "inline" }}>
      <MastheadMain>
        <MastheadBrand>
          <Button variant="plain">
            <Brand
              src={logo}
              alt="Debezium UI Logo"
              heights={{ default: "36px" }}
              onClick={takeHome}
            />
          </Button>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarItem variant="separator" />
            <ToolbarItem>
              <KafkaConnectCluster updateCluster={updateCluster} />
            </ToolbarItem>
            <ToolbarGroup
              variant="icon-button-group"
              align={{ default: "alignRight" }}
              spacer={{ default: "spacerNone", md: "spacerMd" }}
            >
              <ToolbarItem>{notificationBadge}</ToolbarItem>
              <ToolbarItem style={{ paddingLeft: "25px" }}>
                <ToggleGroup
                  aria-label="UI Theme toggle group"
                  className="theme-toggle"
                >
                  <ToggleGroupItem
                    icon={<SunIcon />}
                    aria-label="copy"
                    buttonId="toggle-group-sun-icon"
                    isSelected={themeSelected === "toggle-group-sun-icon"}
                    onChange={handleThemeToggle}
                  />
                  <ToggleGroupItem
                    icon={<MoonIcon />}
                    aria-label="undo"
                    buttonId="toggle-group-moon-icon"
                    isSelected={themeSelected === "toggle-group-moon-icon"}
                    onChange={handleThemeToggle}
                  />
                </ToggleGroup>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};

export default AppHeader;
