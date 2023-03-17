import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
} from '@patternfly/react-core';
import { CubesIcon, PlusCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TransformAlert } from '../TransformsStep';

interface ITransformsStepEmptyStateProps {
  addTransform: () => void;
  handleExampleModalToggle: () => void;
}

export const TransformsStepEmptyState: React.FunctionComponent<
  ITransformsStepEmptyStateProps
> = ({ addTransform, handleExampleModalToggle }) => {
  const { t } = useTranslation();
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        {t('noTransformAdded')}
      </Title>
      <EmptyStateBody>
        <TransformAlert handleExampleModalToggle={handleExampleModalToggle}/>
      </EmptyStateBody>
      <Button
        variant="secondary"
        className="pf-u-mt-lg"
        icon={<PlusCircleIcon />}
        onClick={addTransform}
      >
        {t('addTransform')}
      </Button>
    </EmptyState>
  );
};
