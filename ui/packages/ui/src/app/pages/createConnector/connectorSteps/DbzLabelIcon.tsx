import {
  Popover
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import React from 'react';

export const DbzLabelIcon = () => {
  return (
    <Popover
      headerContent={
        <div>
          The <a href="https://schema.org/name">name</a> of a <a href="https://schema.org/Person">Person</a>
        </div>
      }
      bodyContent={
        <div>
          Often composed of{' '}
          <a href="https://schema.org/givenName" target="_blank">
            givenName
                  </a>{' '}
                  and{' '}
          <a href="https://schema.org/familyName" target="_blank">
            familyName
                  </a>
                  .
                </div>
      }
    >
      <button
        aria-label="More info for name field"
        onClick={e => e.preventDefault()}
        aria-describedby="simple-form-name"
        className="pf-c-form__group-label-help"
      >
        <HelpIcon />
      </button>
    </Popover>
  )
}