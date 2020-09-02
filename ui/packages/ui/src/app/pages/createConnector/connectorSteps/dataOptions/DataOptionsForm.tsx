import {
  Accordion,
  AccordionContent,
  AccordionItem, 
  AccordionToggle, 
  Button, 
  Checkbox,
  Divider,
  Grid, 
  GridItem,
  Title } from '@patternfly/react-core';

import { FormikProps, withFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FormInputComponent, FormSelectComponent } from '../shared';

// Shape of form values
interface IFormValues {
  connection_name: string;
  database_server_name: string;
  database_hostname: string;
  database_port: string;
  database_user: string;
  database_password: string;
  database_dbname: string;
  plugin_name: string;
  slot_name: string;
  publication_name: string;
  publication_autocreate_mode: string;
  slot_drop_on_stop: string;
  slot_stream_params: string;
  database_initial_statements: string;
  slot_max_retries: string;
  slot_retry_delay_ms: string;
  database_tcpKeepAlive: string;
  isRequired: boolean;
}

const timePrecisionModeOptions = [
  { value: 'Adaptive', disabled: false },
  { value: 'Sample', disabled: false }
];

const binaryHandlingModeOptions = [
  { value: 'Bytes', disabled: false },
  { value: 'Sample', disabled: false }
];

const decimalHandlingModeOptions = [
  { value: 'Precise', disabled: false },
  { value: 'Sample', disabled: false }
];

const intervalHandlingModeOptions = [
  { value: 'Numeric', disabled: false },
  { value: 'Sample', disabled: false }
];

const hstoreHandlingModeOptions = [
  { value: 'Map', disabled: false },
  { value: 'Sample', disabled: false }
];

const toastedValuePlaceholderOptions = [
  { value: '__debezium_unavailable_value', disabled: false },
  { value: 'Sample', disabled: false }
];

const messageKeyColumnsOptions = [
  { value: 'Empty string', disabled: false },
  { value: 'Sample', disabled: false }
]

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: FormikProps<IFormValues>) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = props;

  const [expanded, setExpended] = React.useState('basic');
  
  const dbzHandleChange = (e) => {
    handleChange(e);
  }

  const onToggle = (e, id) => {
    e.preventDefault();
    if (id === expanded) {
      setExpended('')
    } else {
      setExpended(id)
    }
  };

  return (
    <form className="pf-c-form" onSubmit={handleSubmit}>
      <Accordion asDefinitionList={true}>
        <AccordionItem>
          <AccordionToggle
            onClick={(e) => { onToggle(e, 'basic') }}
            isExpanded={expanded === 'basic'}
            id="basic"
            className="dbz-c-accordion"
          >
            Mapping Properties
          </AccordionToggle>
          <AccordionContent
            id="basic"
            className="dbz-c-accordion__content"
            isHidden={expanded !== 'basic'}
          >
          <Grid hasGutter={true}>
            <GridItem span={6}>
              <FormSelectComponent  
                label="Precision of time"
                description="Time, date, and timestamps can be represented with different kinds of precisions, including:'adaptive' (the default) bases the precision of time, date, and timestamp values on the database column's precision; 'adaptive_time_microseconds' like 'adaptive' mode, but TIME fields always use microseconds precision;'connect' always represents time, date, and timestamp values using Kafka Connect's built-in representations for Time, Date, and Timestamp, which uses millisecond precision regardless of the database columns' precision ."
                dbzHandleChange={dbzHandleChange}
                fieldId="time_precision_mode"
                options={timePrecisionModeOptions}
              />
            </GridItem>
            <GridItem span={6}>
              <FormSelectComponent  
                label="Binary handling mode"
                description="Specify how binary (blob, binary, etc.) columns should be represented in change events, including:'bytes' represents binary data as byte array (default)'base64' represents binary data as base64-encoded string'hex' represents binary data as hex-encoded (base16) string"
                dbzHandleChange={dbzHandleChange}
                fieldId="binary_handling_mode"
                options={binaryHandlingModeOptions}
              />
            </GridItem>
            <Divider className="c-data-options__spacer" />
            <Title headingLevel="h2" size="2xl">
                Connector
            </Title>
            <GridItem span={4}>
              <FormSelectComponent  
                label="Decimal handling mode"
                description="Specify how DECIMAL and NUMERIC columns should be represented in change events, including:'precise' (the default) uses java.math.BigDecimal to represent values, which are encoded in the change events using a binary representation and Kafka Connect's 'org.apache.kafka.connect.data.Decimal' type; 'string' uses string to represent values; 'double' represents values using Java's 'double', which may not offer the precision but will be far easier to use in consumers."
                dbzHandleChange={dbzHandleChange}
                fieldId="decimal_handling_mode"
                options={decimalHandlingModeOptions}
              />
            </GridItem>
            
            <GridItem span={4}>
              <FormSelectComponent  
                label="Interval handling mode"
                description="Specify how INTERVAL columns should be represented in change events, including:'string' represents values as an exact ISO formatted string'numeric' (default) represents values using the inexact conversion into microseconds"
                dbzHandleChange={dbzHandleChange}
                fieldId="interval_handling_mode"
                options={intervalHandlingModeOptions}
              />
            </GridItem>

            <GridItem span={4}>
              <FormSelectComponent  
                label="Hstore handling mode"
                description="Specify how HSTORE columns should be represented in change events, including:'json' represents values as string-ified JSON (default)'map' represents values as a key/value map"
                dbzHandleChange={dbzHandleChange}
                fieldId="hstore_handling_mode"
                options={hstoreHandlingModeOptions}
              />
            </GridItem>    
            <GridItem>
              <Checkbox
                label="A tombstone event should be generated after a delete event"
                isChecked={true}
                onChange={dbzHandleChange}
                id="tombstones_on_delete"
                name="tombstones_on_delete"
              />
            </GridItem>  
            <Divider className="c-data-options__spacer" />
            <Title headingLevel="h2" size="2xl">
                Columns
            </Title>                 
            <GridItem>
              <FormInputComponent 
                label="Truncate of column"
                description="A comma-separated list of regular expressions matching fully-qualified names of columns that should be truncated to the configured amount of characters."
                fieldId="column_truncate"
                value={values.column_truncate_chars}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />              
            </GridItem>
            <GridItem>
              <FormInputComponent 
                label="Mask of column"
                description="A comma-separated list of regular expressions matching fully-qualified names of columns that should be masked with configured amount of asterisk ('*') characters."
                fieldId="column_mask_chars" 
                value={values.column_mask_chars}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              /> 
            </GridItem>
            <GridItem>
              <FormInputComponent 
                label="Pseudonyms of column"
                description="A comma-separated list of regular expressions matching fully-qualified names of columns that should be masked with configured amount of asterisk ('*') characters."
                fieldId="column_mask_chars" 
                value={values.column_mask_pseudonyms}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              /> 
            </GridItem>
            <GridItem>
              <FormInputComponent 
                label="Propagate column"
                description="A comma-separated list of regular expressions matching fully-qualified names of columns that should be masked with configured amount of asterisk ('*') characters."
                fieldId="column_mask_chars" 
                value={values.column_mask_propagate}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              /> 
            </GridItem>    

            <GridItem>
              <FormSelectComponent  
                label="Message key"
                description="A semicolon-separated list of expressions that match fully-qualified tables and column(s) to be used as message key. Each expression must match the pattern '<fully-qualified table name>:<key columns>',where the table names could be defined as (DB_NAME.TABLE_NAME) or (SCHEMA_NAME.TABLE_NAME), depending on the specific connector,and the key columns are a comma-separated list of columns representing the custom key. For any table without an explicit key configuration the table's primary key column(s) will be used as message key.Example: dbserver1.inventory.orderlines:orderId,orderLineId;dbserver1.inventory.orders:id"
                dbzHandleChange={dbzHandleChange}
                fieldId="message_key_columns"
                options={messageKeyColumnsOptions}
              />
            </GridItem>  
            <GridItem>
              <Checkbox
                label="A tombstone event should be generated after a delete event"
                isChecked={true}
                onChange={dbzHandleChange}
                aria-label="controlled checkbox example"
                id="check-4"
                name="check4"
              />
            </GridItem>   
            <GridItem>
              <FormSelectComponent  
                label="Toasted value"
                description="Specify the constant that will be provided by Debezium to indicate that the original value is a toasted value not provided by the database. If starts with 'hex:' prefix it is expected that the rest of the string repesents hexadecimally encoded octets."
                dbzHandleChange={dbzHandleChange}
                fieldId="toasted_value_placeholder"
                options={toastedValuePlaceholderOptions}
              />
            </GridItem>                                                           
          </Grid>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={(e) => { onToggle(e, 'advance') }}
            isExpanded={expanded === 'advance'}
            id="advance"
            className="dbz-c-accordion"
          >
            Snapshot Properties
          </AccordionToggle>
          <AccordionContent
            id="advance"
            isHidden={expanded !== 'advance'}
          >
            <Grid hasGutter={true}> 
              <FormInputComponent 
                label="Sample"
                fieldId="sample" 
                value={values.sample}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />                                                     
          </Grid>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button variant="primary" type="submit">Submit form</Button>
    </form>
  );
};

// The type of props DataOptionsFormik receives
interface IMyFormProps {
  connection_name: string;
}

// Wrap our form with the withFormik HoC
const DataOptionsFormik = withFormik<IMyFormProps, FormValues>({
  mapPropsToValues: () => ({  
  connection_name:"",
  database_server_name: "",
  database_hostname: "",
  database_port: "",
  database_user: "",
  database_password: "",
  database_dbname: "",
  plugin_name: "",
  slot_name: "",
  publication_name: "",
  publication_autocreate_mode: "",
  slot_drop_on_stop: "",
  slot_stream_params: "",
  database_initial_statements: "",
  slot_max_retries: "",
  slot_retry_delay_ms: "",
  database_tcpKeepAlive: ""
}),

  validationSchema: Yup.object().shape({
      connection_name: Yup.string().required("Please enter connection name"),
      database_hostname: Yup.string().required("Please enter database hostname"),
      database_user: Yup.string().required("Please enter database username"),
      database_password: Yup.string().required("Please enter database password"),
      database_dbname: Yup.string().required("Please enter database name"),
      database_server_name: Yup.string().required("Please enter database server name"),
  }),

  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'DataOptionsFormik'
})(InnerForm);


export const DataOptionsForm:
  React.FC = () => {
    return (
      <DataOptionsFormik className="c-data-options" />
    );
  }
