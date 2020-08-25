import React from 'react';
import * as Yup from 'yup';
import { withFormik, FormikProps } from 'formik';
import {
  Accordion,
  Switch,
  Title, 
  AccordionItem, 
  AccordionContent, 
  Grid, 
  GridItem,
  Button,
  AccordionToggle } from '@patternfly/react-core';
import { FormInputComponent } from './FormInputComponent';

// Shape of form values
interface FormValues {
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

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: FormikProps<FormValues>) => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = props;

  const [expanded, setExpended] = React.useState('basic');
  const dbzHandleChange = (val, e) => handleChange(e);

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
      <Accordion>
        <AccordionItem>
          <AccordionToggle
            onClick={(e) => { onToggle(e, 'basic') }}
            isExpanded={expanded === 'basic'}
            id="basic"
            className="dbz-c-accordion"
          >
            Basic Properties
          </AccordionToggle>
          <AccordionContent
            id="basic"
            className="dbz-c-accordion__content"
            isHidden={expanded !== 'basic'}
          >
          <Grid>
            <FormInputComponent 
              isRequired={true}
              label="Name" 
              fieldId="connection_name" 
              helperTextInvalid={errors.connection_name}
              validated={errors.connection_name && touched.connection_name ? 'error' : ''}
              value={values.connection_name}
              dbzHandleChange={dbzHandleChange}
              onBlur={handleBlur}
            />

            <GridItem span={6}>
              <FormInputComponent 
                isRequired={true} 
                label="Connection URL" 
                fieldId="database_hostname" 
                helperTextInvalid={errors.database_hostname}
                validated={errors.database_hostname && touched.database_hostname ? 'error' : ''}
                value={values.database_hostname}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />              
              
            </GridItem>
            <GridItem span={6}>
              <FormInputComponent
                label="Port" 
                fieldId="database_port" 
                helperTextInvalid={errors.database_port}
                validated={errors.database_port && touched.database_port ? 'error' : ''}
                value={values.database_port}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />
            </GridItem>
            <GridItem>
              <FormInputComponent 
                isRequired={true} 
                label="Username" 
                fieldId="database_user" 
                helperTextInvalid={errors.database_user}
                validated={errors.database_user && touched.database_user ? 'error' : ''}
                value={values.database_user}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />
            </GridItem>
            <GridItem>
              <FormInputComponent 
                isRequired={true} 
                type="password"
                label="Password" 
                fieldId="database_password" 
                helperTextInvalid={errors.database_password}
                validated={errors.database_password && touched.database_password ? 'error' : ''}
                value={values.database_password}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />
            </GridItem>
            <GridItem>
              <FormInputComponent 
                isRequired={true} 
                type="password"
                label="Database name" 
                fieldId="database_dbname" 
                helperTextInvalid={errors.database_dbname}
                validated={errors.database_dbname && touched.database_dbname ? 'error' : ''}
                value={values.database_dbname}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />              
            </GridItem>
            <GridItem>
              <FormInputComponent 
                isRequired={true} 
                label="Namespace of server/cluster"
                fieldId="database_server_name" 
                helperTextInvalid={errors.database_server_name}
                validated={errors.database_server_name && touched.database_server_name ? 'error' : ''}
                value={values.database_server_name}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
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
            Advance Properties
          </AccordionToggle>
          <AccordionContent
            id="advance"
            isHidden={expanded !== 'advance'}
          >
            <Grid>
              <Switch
                id="database_tcpKeepAlive"
                label="Disable TCP keep-alive"
                labelOff="Enable TCP keep-alive"
                isChecked={false}
                value={values.database_tcpKeepAlive}
              />   
              <FormInputComponent 
                label="SQL statement of JDBC connection"
                fieldId="database_initial_statements" 
                helperTextInvalid={errors.database_initial_statements}
                validated={errors.database_initial_statements && touched.database_initial_statements ? 'error' : ''}
                value={values.database_initial_statements}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              /> 
              <Title headingLevel="h2" size="2xl">
                Replicatin slot
              </Title>
              <FormInputComponent 
                label="Replication slot name"
                fieldId="slot_name" 
                helperTextInvalid={errors.slot_name}
                validated={errors.slot_name && touched.slot_name ? 'error' : ''}
                value={values.slot_name}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />                    
              <Switch
                id="slot_drop_on_stop"
                label="Droping the slot"
                labelOff="Droping the slot"
                isChecked={false}
              />   
              <FormInputComponent 
                label="Slot.stream.params"
                fieldId="slot_stream_params" 
                helperTextInvalid={errors.slot_stream_params}
                validated={errors.slot_stream_params && touched.slot_stream_params ? 'error' : ''}
                value={values.slot_stream_params}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />               
            <GridItem span={6}>  
              <FormInputComponent 
                label="Slot.max.retries(Seconds)"
                fieldId="slot_max_retries" 
                helperTextInvalid={errors.slot_max_retries}
                validated={errors.slot_max_retries && touched.slot_max_retries ? 'error' : ''}
                value={values.slot_max_retries}
                dbzHandleChange={dbzHandleChange}
                onBlur={handleBlur}
              />             
          </GridItem>
          <GridItem span={6}>
            <FormInputComponent 
              label="Slot.retry.delay.ms(10 seconds)"
              fieldId="slot_retry_delay_ms" 
              helperTextInvalid={errors.slot_retry_delay_ms}
              validated={errors.slot_retry_delay_ms && touched.slot_retry_delay_ms ? 'error' : ''}
              value={values.slot_retry_delay_ms}
              dbzHandleChange={dbzHandleChange}
              onBlur={handleBlur}
            />             
          </GridItem>
          <GridItem>
            <Title headingLevel="h2" size="2xl">
              Publication
            </Title>  
          </GridItem>
          <GridItem>
            <FormInputComponent 
              label="Name of publication"
              fieldId="publication_name" 
              helperTextInvalid={errors.publication_name}
              validated={errors.publication_name && touched.publication_name ? 'error' : ''}
              value={values.publication_name}
              dbzHandleChange={dbzHandleChange}
              onBlur={handleBlur}
            />             
          </GridItem>
          <GridItem>
            <FormInputComponent 
              label="Publication Auto Create Mode"
              fieldId="publication_autocreate_mode" 
              helperTextInvalid={errors.publication_autocreate_mode}
              validated={errors.publication_autocreate_mode && touched.publication_autocreate_mode ? 'error' : ''}
              value={values.publication_autocreate_mode}
              dbzHandleChange={dbzHandleChange}
              onBlur={handleBlur}
            />             
          </GridItem>      
          <GridItem>
            <FormInputComponent 
              label="Plugins"
              fieldId="plugin_name" 
              helperTextInvalid={errors.plugin_name}
              validated={errors.plugin_name && touched.plugin_name ? 'error' : ''}
              value={values.plugin_name}
              dbzHandleChange={dbzHandleChange}
              onBlur={handleBlur}
            />            
          </GridItem>                                                        
          </Grid>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <Button variant="primary" type="submit">Submit form</Button> */}
    </form>
  );
};

// The type of props MyForm receives
interface MyFormProps {
  connection_name: string;
}

// Wrap our form with the withFormik HoC
const MyForm = withFormik<MyFormProps, FormValues>({
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
  displayName: 'BasicForm'
})(InnerForm);


export const ConfigureConnectorTypeForm:
  React.FC<IConfigureConnectorTypeComponentProps> = () => {
    return (
      <MyForm />
    );
  }
