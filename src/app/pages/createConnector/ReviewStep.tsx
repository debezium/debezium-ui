import { getConnectorClass } from "@app/utils";
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Button,
  Checkbox,
  Switch,
  Divider,
  CodeBlock,
  CodeBlockCode,
  ClipboardCopyButton,
  CodeBlockAction,
  Tooltip,
} from "@patternfly/react-core";
import {
  EyeIcon,
  EyeSlashIcon,
  FileDownloadIcon,
  PlayIcon,
  PlusCircleIcon,
} from "@patternfly/react-icons";
import React from "react";

interface ReviewStepProps {
  // Add any props you need for the ReviewStep component
  connectorSchema: Record<string, ConnectorProperties>;
  connectorName: Record<string, any>;
  connectorType: string | undefined;
  connectorProperties: Record<string, any>;
  customProperties: Record<string, any>;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  connectorSchema,
  connectorName,
  connectorType,
  connectorProperties,
  customProperties,
}) => {
  // Add your component logic here
  const [showJson, setShowJson] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const clipboardCopyFunc = (_event: any, text: string) => {
    navigator.clipboard.writeText(text.toString());
  };

  const onClick = (_event: any, text: string) => {
    clipboardCopyFunc(event, text);
    setCopied(true);
  };

  const downloadFile = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: string
  ) => {
    const downloadJson = event.currentTarget.parentElement;
    const file = "debeziumConfig.json";
    const json = data;
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = file;
    downloadJson!.appendChild(link);
    link.click();
    downloadJson!.removeChild(link);
  };

  const connectorJsonPayload = JSON.stringify({name: connectorName.name,config:{"connector.class": getConnectorClass(connectorType), ...connectorProperties, ...customProperties}}, null, 2);

  const actions = (
    <React.Fragment>
      <Tooltip
        content={
          <div>
            {showPassword ? "Hide protected fields" : "Show hidden fields"}
          </div>
        }
      >
        <CodeBlockAction>
          <Button
            variant="plain"
            aria-label={"show hidden fields icon"}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </Button>
        </CodeBlockAction>
      </Tooltip>

      <CodeBlockAction>
        <ClipboardCopyButton
          id="copy-json-payload"
          textId="code-json-payload"
          aria-label="Copy to clipboard"
          onClick={(e) =>
            onClick(e, connectorJsonPayload)
          }
          exitDelay={copied ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCopied(false)}
        >
          {copied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
        </ClipboardCopyButton>
      </CodeBlockAction>
      <CodeBlockAction>
        <Tooltip
          content={
            <div>
              Download the JSON payload to your local machine.
              <br />
              <b>Note:</b> The downloaded JSON payload will contain non
              encrypted protected field.
            </div>
          }
        >
          <Button
            variant="plain"
            aria-label="Download icon"
            onClick={(e) =>
              downloadFile(e, connectorJsonPayload)
            }
          >
            <FileDownloadIcon />
          </Button>
        </Tooltip>
      </CodeBlockAction>
    </React.Fragment>
  );

  return (
    <div>
      <Checkbox
        id="json-view-checkbox"
        isChecked={showJson}
        label="JSON View"
        description="View the connector payload in JSON representation, you can also copy or download the JSON payload."
        style={{ paddingBottom: "15px" }}
        onChange={() => setShowJson(!showJson)}
      />
      {/* <Divider /> */}
      {/* <Switch
      id="json-view-checkbox"
      label="JSON View"
      labelOff="Table View"
      isChecked={true}
      onChange={() => {}}
      ouiaId="BasicSwitch"
    /> */}
      {showJson ? (
        <CodeBlock actions={actions} style={{ paddingTop: "15px" }}>
          <CodeBlockCode id="json-content">
            {connectorJsonPayload}
          </CodeBlockCode>
        </CodeBlock>
      ) : (
        <DescriptionList
          style={{ paddingTop: "15px" }}
          isCompact
          isHorizontal
          horizontalTermWidthModifier={{
            default: "12ch",
            sm: "15ch",
            md: "20ch",
            lg: "28ch",
            xl: "30ch",
            "2xl": "35ch",
          }}
        >
          <DescriptionListGroup>
                <DescriptionListTerm>
                  Connector name
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {connectorName.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  Connector class
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {getConnectorClass(connectorType)}
                </DescriptionListDescription>
              </DescriptionListGroup>
          {Object.keys(connectorProperties).map((property: string) => {
            return (
              <DescriptionListGroup key={property}>
                <DescriptionListTerm>
                  {connectorSchema[property].title}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {connectorProperties[property]}
                </DescriptionListDescription>
              </DescriptionListGroup>
            );
          })}
        </DescriptionList>
      )}
    </div>
  );
};
