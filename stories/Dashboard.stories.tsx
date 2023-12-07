import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';
import { CreateConnectorWizard } from '@app/pages/createConnector';


//👇 This default export determines where your story goes in the story list
export default {
  title: 'Components/CreateConnectorWizard',
  component: CreateConnectorWizard,
};

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof CreateConnectorWizard>> = (args) => <CreateConnectorWizard {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = {
  /*👇 The args you need here will depend on your component */
};
