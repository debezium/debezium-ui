import { StackItem, Button, Card, CardTitle, CardBody, Split, SplitItem, TextInput, CardFooter } from "@patternfly/react-core"
import { PlusCircleIcon } from "@patternfly/react-icons"
import React from "react"
import { FunctionComponent } from "react"

export interface IConfigureMissingPropertiesProps {

}
export const ConfigureMissingProperties: FunctionComponent = (props: IConfigureMissingPropertiesProps) => {
    
    const [hasCustomProperties, setHasCustomProperties] =
    React.useState<boolean>(false);

  // const [customProperties, setCustomProperties] = React.useState<Map<string,string>>(new Map());

  const toggleCustomProperties = () => {
    setHasCustomProperties(!hasCustomProperties);

  };
    
    return (
        <StackItem>
        {!hasCustomProperties ? (
          <Button variant="secondary" onClick={toggleCustomProperties}>
            Configure missing properties
          </Button>
        ) : (
          
          <Card style={{ marginTop: '15px', width: '40%' }}>
            <CardTitle>Configure missing properties</CardTitle>
            {/* {Array.from(customProperties.keys()).map((key, index) => {} )} */}
            <CardBody>
              <Split>
                <SplitItem>
                  <TextInput
                    value={''}
                    type="text"
                    placeholder="Key"
                    onChange={() => {}}
                    aria-label="text input example"
                  />
                </SplitItem>
                <SplitItem style={{ fontSize: 'x-large' }}>
                  &nbsp; : &nbsp;
                </SplitItem>
                <SplitItem>
                  <TextInput
                    value={''}
                    type="text"
                    placeholder="Value"
                    onChange={() => {}}
                    aria-label="text input example"
                  />
                </SplitItem>
                <SplitItem>
                  <Button variant="link" icon={<PlusCircleIcon />}>
                    Add
                  </Button>
                </SplitItem>
              </Split>
            </CardBody>
            <CardFooter>
              <Button variant="secondary">Apply</Button>
              <Button variant="link" onClick={toggleCustomProperties}>Cancel</Button>
            </CardFooter>
          </Card>
        )}
      </StackItem>)
}
