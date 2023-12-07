/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertProps,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  MenuToggle,
  MenuToggleElement,
  NotificationBadge,
  NotificationBadgeVariant,
  NotificationDrawer,
  NotificationDrawerBody,
  NotificationDrawerHeader,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
  Page,
  PageSection,
  PageSectionVariants,
  SkipToContent,
  Text,
  TextContent,
  ToolbarItem,
  getUniqueId,
} from "@patternfly/react-core";

import AppHeader from "./AppHeader";
import { AppLayoutContext } from "./AppLayoutContext";
import { EllipsisVIcon, SearchIcon } from "@patternfly/react-icons";
import { AppBreadcrumb } from "@app/components";
import { useLocation } from "react-router-dom";

interface IAppLayout {
  children: React.ReactNode;
}

export interface NotificationProps {
  title: string;
  srTitle: string;
  variant: "success" | "danger" | "warning" | "info" | "custom" | undefined;
  key: React.Key;
  timestamp: string;
  description: string;
  isNotificationRead: boolean;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [cluster, setCluster] = React.useState<string>("");
  // const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const maxDisplayed = 3;
  const alertTimeout = 8000;

  const getUniqueId = () => new Date().getTime();

  const getTimeCreated = () => {
    const dateCreated = new Date();
    return (
      dateCreated.toDateString() +
      " at " +
      ("00" + dateCreated.getHours().toString()).slice(-2) +
      ":" +
      ("00" + dateCreated.getMinutes().toString()).slice(-2)
    );
  };

  const location = useLocation();

  const removeAlert = (key: React.Key) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.props.id !== key.toString())
    );
  };

  const addNewNotification = (
    variant: NotificationProps["variant"],
    heading?: string,
    msg?: string
  ) => {
    const variantFormatted =
      variant!.charAt(0).toUpperCase() + variant!.slice(1);
    const title = heading || variantFormatted + " alert notification";
    const srTitle = variantFormatted + " alert";
    const description =
      msg || variantFormatted + " alert notification description";
    const key = getUniqueId();
    const timestamp = getTimeCreated();

    setNotifications((prevNotifications) => [
      {
        title,
        srTitle,
        variant,
        key,
        timestamp,
        description,
        isNotificationRead: false,
      },
      ...prevNotifications,
    ]);

    if (!isDrawerExpanded) {
      setAlerts((prevAlerts) => [
        <Alert
          variant={variant}
          title={title}
          timeout={alertTimeout}
          onTimeout={() => removeAlert(key)}
          isLiveRegion
          actionClose={
            <AlertActionCloseButton
              title={title}
              variantLabel={`${variant} alert`}
              onClose={() => removeAlert(key)}
            />
          }
          key={key}
          id={key.toString()}
        >
          <p>{description}</p>
        </Alert>,
        ...prevAlerts,
      ]);
    }
  };

  const [alerts, setAlerts] = React.useState<React.ReactElement<AlertProps>[]>(
    []
  );
  const [isDrawerExpanded, setDrawerExpanded] = React.useState(false);
  const [openDropdownKey, setOpenDropdownKey] =
    React.useState<React.Key | null>(null);

  const [overflowMessage, setOverflowMessage] = React.useState<string>("");
  const [notifications, setNotifications] = React.useState<NotificationProps[]>(
    []
  );

  const handleClusterChange = (url: string) => {
    setCluster(url);
  };

  const onDropdownSelect = () => {
    setOpenDropdownKey(null);
  };

  const onAlertGroupOverflowClick = () => {
    removeAllAlerts();
    setDrawerExpanded(true);
  };

  const removeAllAlerts = () => {
    setAlerts([]);
  };

  const isNotificationRead = (key: React.Key) =>
    notifications.find((notification) => notification.key === key)
      ?.isNotificationRead;

  React.useEffect(() => {
    setOverflowMessage(buildOverflowMessage());
  }, [maxDisplayed, notifications, alerts]);

  const buildOverflowMessage = () => {
    const overflow = alerts.length - maxDisplayed;
    if (overflow > 0 && maxDisplayed > 0) {
      return `View ${overflow} more notification(s) in notification drawer`;
    }
    return "";
  };

  const onDropdownToggle = (id: React.Key) => {
    if (id && openDropdownKey !== id) {
      setOpenDropdownKey(id);
      return;
    }
    setOpenDropdownKey(null);
  };

  const removeAllNotifications = () => {
    setNotifications([]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isNotificationRead: true,
      }))
    );
  };

  const getUnreadNotificationsNumber = () =>
    notifications.filter(
      (notification) => notification.isNotificationRead === false
    ).length;

  const containsUnreadAlertNotification = () =>
    notifications.filter(
      (notification) =>
        notification.isNotificationRead === false &&
        notification.variant === "danger"
    ).length > 0;

  const removeNotification = (key: React.Key) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.key !== key)
    );
  };

  const getNotificationBadgeVariant = () => {
    if (getUnreadNotificationsNumber() === 0) {
      return NotificationBadgeVariant.read;
    }
    if (containsUnreadAlertNotification()) {
      return NotificationBadgeVariant.attention;
    }
    return NotificationBadgeVariant.unread;
  };

  const onNotificationBadgeClick = () => {
    removeAllAlerts();
    setDrawerExpanded(!isDrawerExpanded);
  };

  const notificationBadge = (
    <ToolbarItem>
      <NotificationBadge
        variant={getNotificationBadgeVariant()}
        onClick={onNotificationBadgeClick}
        aria-label="Notifications"
      ></NotificationBadge>
    </ToolbarItem>
  );

  const notificationDrawerActions = (
    <>
      <DropdownItem key="markAllRead" onClick={markAllNotificationsRead}>
        Mark all read
      </DropdownItem>
      <DropdownItem key="clearAll" onClick={removeAllNotifications}>
        Clear all
      </DropdownItem>
    </>
  );

  const markNotificationRead = (key: React.Key) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.key === key
          ? { ...notification, isNotificationRead: true }
          : notification
      )
    );
  };

  const notificationDrawerDropdownItems = (key: React.Key) => [
    <DropdownItem
      key={`markRead-${key}`}
      onClick={() => markNotificationRead(key)}
    >
      Mark as read
    </DropdownItem>,
    <DropdownItem key={`clear-${key}`} onClick={() => removeNotification(key)}>
      Clear
    </DropdownItem>,
  ];

  const notificationDrawer = (
    <NotificationDrawer>
      <NotificationDrawerHeader
        count={getUnreadNotificationsNumber()}
        onClose={(_event) => setDrawerExpanded(false)}
      >
        <Dropdown
          id="notification-drawer-0"
          isOpen={openDropdownKey === "dropdown-toggle-id-0"}
          onSelect={onDropdownSelect}
          popperProps={{ position: "right" }}
          onOpenChange={(isOpen: boolean) =>
            !isOpen && setOpenDropdownKey(null)
          }
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              isExpanded={openDropdownKey === "dropdown-toggle-id-0"}
              variant="plain"
              onClick={() => onDropdownToggle("dropdown-toggle-id-0")}
              aria-label="Notification drawer actions"
            >
              <EllipsisVIcon aria-hidden="true" />
            </MenuToggle>
          )}
        >
          <DropdownList>{notificationDrawerActions}</DropdownList>
        </Dropdown>
      </NotificationDrawerHeader>
      <NotificationDrawerBody>
        {notifications.length !== 0 && (
          <NotificationDrawerList>
            {notifications.map(
              (
                { key, variant, title, srTitle, description, timestamp },
                index
              ) => (
                <NotificationDrawerListItem
                  key={key}
                  variant={variant}
                  isRead={isNotificationRead(key)}
                  onClick={() => markNotificationRead(key)}
                >
                  <NotificationDrawerListItemHeader
                    variant={variant}
                    title={title}
                    srTitle={srTitle}
                  >
                    <Dropdown
                      id={key.toString()}
                      isOpen={openDropdownKey === key}
                      onSelect={onDropdownSelect}
                      popperProps={{ position: "right" }}
                      onOpenChange={(isOpen: boolean) =>
                        !isOpen && setOpenDropdownKey(null)
                      }
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          isExpanded={openDropdownKey === key}
                          variant="plain"
                          onClick={() => onDropdownToggle(key)}
                          aria-label={`Notification ${index + 1} actions`}
                        >
                          <EllipsisVIcon aria-hidden="true" />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        {notificationDrawerDropdownItems(key)}
                      </DropdownList>
                    </Dropdown>
                  </NotificationDrawerListItemHeader>
                  <NotificationDrawerListItemBody timestamp={timestamp}>
                    {" "}
                    {description}{" "}
                  </NotificationDrawerListItemBody>
                </NotificationDrawerListItem>
              )
            )}
          </NotificationDrawerList>
        )}
        {notifications.length === 0 && (
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateHeader
              headingLevel="h2"
              titleText="No notifications found"
              icon={<EmptyStateIcon icon={SearchIcon} />}
            />
            <EmptyStateBody>
              There are currently no notifications.
            </EmptyStateBody>
          </EmptyState>
        )}
      </NotificationDrawerBody>
    </NotificationDrawer>
  );

  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // const location = useLocation();

  // const renderNavItem = (route: IAppRoute, index: number) => (
  //   <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
  //     <NavLink exact={route.exact} to={route.path}>
  //       {route.label}
  //     </NavLink>
  //   </NavItem>
  // );

  // const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
  //   <NavExpandable
  //     key={`${group.label}-${groupIndex}`}
  //     id={`${group.label}-${groupIndex}`}
  //     title={group.label}
  //     isActive={group.routes.some((route) => route.path === location.pathname)}
  //   >
  //     {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
  //   </NavExpandable>
  // );

  // const Navigation = (
  //   <Nav id="nav-primary-simple" theme="dark">
  //     <NavList id="nav-list-simple">
  //       {routes.map(
  //         (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx))
  //       )}
  //     </NavList>
  //   </Nav>
  // );

  // const Sidebar = (
  //   <PageSidebar theme="dark" >
  //     <PageSidebarBody>
  //       {Navigation}
  //     </PageSidebarBody>
  //   </PageSidebar>
  // );

  const pageId = "primary-app-container";

  // const PageTemplateTitle = (
  //   <PageSection variant="light">
  //     <TextContent>
  //       <Text component="h1">Connectors</Text>
  //       <Text component="p">This list show all the connectors that have been created on the cluster, you can create a new connector by clicking on
  //             the &quot;Create connector&quot; button.</Text>
  //     </TextContent>
  //   </PageSection>
  // );

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer && primaryContentContainer.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );
  return (
    <AppLayoutContext.Provider value={{ cluster, addNewNotification }}>
      <Page
        mainContainerId={pageId}
        header={
          <AppHeader
            // toggleSidebar={toggleSidebar}
            updateCluster={handleClusterChange}
            notificationBadge={notificationBadge}
          />
        }
        // sidebar={sidebarOpen && Sidebar}
        breadcrumb={
          location.pathname === "/" ? (
            <></>
          ) : (
            <AppBreadcrumb path={location.pathname} />
          )
        }
        skipToContent={PageSkipToContent}
        notificationDrawer={notificationDrawer}
        isNotificationDrawerExpanded={isDrawerExpanded}
      >
        {/* {PageTemplateTitle} */}
        {children}
      </Page>
        <AlertGroup
          isToast
          isLiveRegion
          onOverflowClick={onAlertGroupOverflowClick}
          overflowMessage={overflowMessage}
        >
          {alerts.slice(0, maxDisplayed)}
        </AlertGroup>
    </AppLayoutContext.Provider>
  );
};

export { AppLayout };
