import {
  Modal,
  ModalVariant,
  Button,
  FormGroup,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Form,
} from "@patternfly/react-core";
import React from "react";
import { validate } from "./FormInputComponent";
import { Services } from "@app/apis/services";
import { AppLayoutContext } from "@app/AppLayout";
import { useNavigate } from "react-router-dom";

interface DeleteConnectorModelProps {
  deleteConnectorName: string;
  isDeleteModalOpen: boolean;
  updateDeleteModalOpen: (isOpen: boolean) => void;
  navigateTo?: string;
}

export const DeleteConnectorModel: React.FC<DeleteConnectorModelProps> = ({
  deleteConnectorName,
  isDeleteModalOpen,
  updateDeleteModalOpen,
  navigateTo,
}) => {
  const navigate = useNavigate();

  //   const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [validated, setValidated] = React.useState<validate>("default");
  const [deleteConnectorNameConfirmation, setDeleteConnectorNameConfirmation] =
    React.useState("");

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const clearDeleteOperation = () => {
    setDeleteConnectorNameConfirmation("");
    // setDeleteConnectorName('');
    updateDeleteModalOpen(false);
    setValidated("default");
  };

  const handleNameChange = (_event: any, name: string) => {
    setDeleteConnectorNameConfirmation(name);
    if (name === deleteConnectorName && name !== "") {
      setValidated("success");
    } else {
      setValidated("error");
    }
  };

  const deleteConnector = () => {
    if (
      deleteConnectorName === deleteConnectorNameConfirmation &&
      deleteConnectorName !== ""
    ) {
      connectorService
        .deleteConnector(clusterUrl, deleteConnectorName)
        .then((cConnectors: any) => {
          addNewNotification(
            "success",
            "Connector deleted",
            `Connector "${deleteConnectorName}" deleted successfully.`
          );
          clearDeleteOperation();
          navigateTo && navigateTo !== "" && navigate(navigateTo);
        })
        .catch((err) => {
          addNewNotification("danger", "Connector delete failed", err.message);
        });
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title={`Delete "${deleteConnectorName}" connector?`}
      titleIconVariant="warning"
      isOpen={isDeleteModalOpen}
      onClose={clearDeleteOperation}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          isDisabled={deleteConnectorName !== deleteConnectorNameConfirmation}
          onClick={deleteConnector}
        >
          Confirm
        </Button>,
        <Button key="cancel" variant="link" onClick={clearDeleteOperation}>
          Cancel
        </Button>,
      ]}
    >
      <Form>
        <FormGroup label="Connector name" fieldId="delete-connector-name">
          <TextInput
            isRequired
            validated={validated}
            type="text"
            id="delete-connector-name-text"
            name="delete-connector-name-text"
            aria-describedby="Delete connector name"
            value={deleteConnectorNameConfirmation}
            onChange={handleNameChange}
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Confirm the connector name you want to delete.
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </Form>
    </Modal>
  );
};
