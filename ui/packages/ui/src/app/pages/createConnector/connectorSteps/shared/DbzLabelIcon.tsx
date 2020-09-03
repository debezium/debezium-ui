import {
  Popover
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import React from 'react';

export const DbzLabelIcon = ({label, description}) => {
  return (
    <Popover
      headerContent={
        <div>
          {label}
        </div>
      }
      bodyContent={<div>{description}</div>}
    >
      <button
        onClick={e => e.preventDefault()}
        className="pf-c-form__group-label-help"
      >
        <HelpIcon />
      </button>
    </Popover>
  )
}