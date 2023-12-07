/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  ActionsColumn,
  IAction,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import {
  ConnectorStatusComponent,
  ConnectorTask,
  ConnectorTypeLogo,
  DeleteConnectorModel,
} from "@app/components";
import { AppLayoutContext, NotificationProps } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import { useNavigate } from "react-router-dom";

interface Props {
  connectorsStatus: Record<string, ConnectorStatus>;
  connectorsInfo: Record<string, ConnectorInfo>;
  addNewNotification: (
    variant: NotificationProps["variant"],
    heading?: string,
    msg?: string
  ) => void;
}
type validate = "success" | "warning" | "error" | "default";

const ConnectorTable: React.FC<Props> = ({
  connectorsStatus,
  connectorsInfo,
  addNewNotification,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteConnectorName, setDeleteConnectorName] =
    React.useState<string>("");

  const navigate = useNavigate();

  const updateDeleteModalOpen = (isOpen: boolean) => {
    setIsDeleteModalOpen(isOpen);
  };

  const appLayoutContext = React.useContext(AppLayoutContext);
  const clusterUrl = appLayoutContext.cluster;
  const connectorService = Services.getConnectorService();

  const deleteConnectorModal = (connectorName: string) => {
    setIsDeleteModalOpen(true);
    setDeleteConnectorName(connectorName);
  };

  const goToConnectorDetail = (connectorName: string) => {
    navigate(`/connector/${connectorName}`);
  };

  const defaultActions = (connectorName: string): IAction[] => [
    {
      title: "Pause",
      onClick: () => {
        connectorService
          .pauseConnector(clusterUrl, connectorName)
          .then((cConnectors: any) => {
            addNewNotification(
              "info",
              "Connector paused",
              `Connector "${connectorName}" paused successfully.`
            );
          })
          .catch((err) => {
            console.log("error", err);
          });
      },
    },
    {
      title: "Resume",
      onClick: () => {
        connectorService
          .resumeConnector(clusterUrl, connectorName)
          .then((cConnectors: any) => {
            addNewNotification(
              "success",
              "Connector resumed",
              `Connector "${connectorName}" resumed successfully.`
            );
          })
          .catch((err) => {
            console.log("error", err);
          });
      },
    },
    {
      isSeparator: true,
    },
    {
      title: "Restart connector",
      onClick: () => {
        connectorService
          .restartConnector(clusterUrl, connectorName)
          .then((cConnectors: any) => {
            addNewNotification(
              "success",
              "Connector restarted",
              `Connector "${connectorName}" restarted successfully.`
            );
          })
          .catch((err) => {
            console.log("error", err);
          });
      },
    },
    {
      title: <a href="https://www.patternfly.org">Edit connector</a>,
    },
    {
      isSeparator: true,
    },
    {
      title: "Delete connector",
      onClick: () => deleteConnectorModal(connectorName),
    },
  ];

  return (
    <>
      <Table aria-label="Actions table">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Tasks</Th>
            <Td></Td>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(connectorsStatus).map((connectorName) => {
            // connectorList.map((connectorName) => {
            // Arbitrary logic to determine which rows get which actions in this example
            const rowActions: IAction[] | null = defaultActions(connectorName);

            // if (repo.name === '5') {
            //   rowActions = lastRowActions(repo);
            // }
            // let singleActionButton: React.ReactNode = null;
            // if (repo.singleAction !== '') {
            //   singleActionButton = (
            //     <TableText>
            //       <Button variant="secondary">{repo.singleAction}</Button>
            //     </TableText>
            //   );
            // }

            return (
              <Tr key={connectorName}>
                <Td dataLabel="connector-image">
                  <ConnectorTypeLogo
                    type={
                      connectorsInfo[connectorName].info.config[
                        "connector.class"
                      ]
                    }
                  />
                </Td>
                <Td dataLabel="name">
                  <a onClick={() => goToConnectorDetail(connectorName)}>
                    {connectorName}
                  </a>
                </Td>
                <Td dataLabel="status">
                  <ConnectorStatusComponent
                    status={
                      connectorsStatus[connectorName].status.connector.state
                    }
                  />
                </Td>
                <Td dataLabel="task">
                  <ConnectorTask
                    connectorTasks={
                      connectorsStatus[connectorName].status.tasks!
                    }
                  />
                </Td>
                <Td></Td>

                <Td isActionCell>
                  {rowActions ? (
                    <ActionsColumn
                      items={rowActions}
                      isDisabled={false} // Also arbitrary for the example
                      //   actionsToggle={exampleChoice === 'customToggle' ? customActionsToggle : undefined}
                    />
                  ) : null}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <DeleteConnectorModel
        deleteConnectorName={deleteConnectorName}
        isDeleteModalOpen={isDeleteModalOpen}
        updateDeleteModalOpen={updateDeleteModalOpen}
      />
    </>
  );
};

export default ConnectorTable;
