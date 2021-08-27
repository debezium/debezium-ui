import {
  Alert,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid,
  GridItem,
  Title
} from '@patternfly/react-core';
import React from 'react';
import { TransformCard } from 'components';
import transformResponse from '../../../../../assets/mockResponse/transform.json';
import MultiRef from 'react-multi-ref';
import { CubesIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

export interface ITransformData {
  key: number;
  name?: string;
  type?: string;
  config?: any;
}
export interface ITransformStepProps {
  transformsValues: Map<string, any>;
  updateTransformValues: (data: any) => void;
  setIsTransformDirty: (data: boolean) => void;
  selectedConnectorType: string;
}

export const TransformsStep: React.FunctionComponent<ITransformStepProps> = props => {
  const { t } = useTranslation();

  const [transforms, setTransforms] = React.useState<Map<number, ITransformData>>(new Map<number, ITransformData>());

  // tslint:disable-next-line: variable-name
  const _items = new MultiRef();

  const addTransform = () => {
    const transformsCopy = new Map(transforms);
    transformsCopy.set(transformsCopy.size + 1, { key: Math.random() * 10000, config: {} });
    setTransforms(transformsCopy);
    props.setIsTransformDirty(true);
  };

  const deleteTransformCallback = React.useCallback(
    order => {
      const transformsCopy = new Map(transforms);
      transformsCopy.delete(order);
      const transformResult = new Map<number, any>();
      for (const [key, value] of transformsCopy.entries()) {
        if (key > order) {
          transformResult.set(+key - 1, value);
        } else if (key < order) {
          transformResult.set(+key, value);
        }
      }
      setTransforms(transformResult);
      if (transformResult.size === 0) {
        props.setIsTransformDirty(false);
        props.updateTransformValues(new Map());
      }
    },
    [transforms]
  );

  const moveTransformOrder = React.useCallback(
    (order, position) => {
      const transformsCopy = new Map<number, ITransformData>(transforms);
      switch (position) {
        case 'top':
          transformsCopy.set(1, transforms.get(order)!);
          let i = 1;
          while (i < order) {
            transformsCopy.set(i + 1, transforms.get(i)!);
            i++;
          }
          break;
        case 'up':
          transformsCopy.set(order - 1, transforms.get(order)!);
          transformsCopy.set(order, transforms.get(order - 1)!);
          break;
        case 'down':
          transformsCopy.set(order + 1, transforms.get(order)!);
          transformsCopy.set(order, transforms.get(order + 1)!);
          break;
        case 'bottom':
          transformsCopy.set(transforms.size, transforms.get(order)!);
          let j = transforms.size;
          while (j > order) {
            transformsCopy.set(j - 1, transforms.get(j)!);
            j--;
          }
          break;
        default:
          break;
      }
      setTransforms(transformsCopy);
      props.setIsTransformDirty(true);
    },
    [transforms]
  );

  const getNameList = (): string[] => {
    const nameList: string[] = [];
    transforms.forEach(val => {
      val.name && nameList.push(val.name);
    });
    return nameList;
  };

  const saveTransforms = () => {
    _items.map.forEach((input:any) => {
      input.validate();
    });
  };

  const updateTransformCallback = React.useCallback(
    (key: number, field: string, value: any) => {
      const transformsCopy = new Map(transforms);
      const transformCopy = transforms.get(key);
      if (field === 'name' || field === 'type') {
        transformCopy![field] = value;
        props.setIsTransformDirty(true);
      } else {
        transformCopy!.config = value;
      }
      transformsCopy.set(key, transformCopy!);
      setTransforms(transformsCopy);
    },
    [transforms]
  );

  React.useEffect(() => {
    if (transforms.size > 0) {
      const transformValues = new Map();
      transforms.forEach(val => {
        if (val.name && val.type) {
          transformValues.has('transforms')
            ? transformValues.set('transforms', transformValues.get('transforms') + ',' + val.name)
            : transformValues.set('transforms', val.name);
          transformValues.set(`transforms.${val.name}.type`, val.type);
          for (const [key, value] of Object.entries(val.config)) {
            transformValues.set(`transforms.${val.name}.${key}`, value);
          }
        }
      });
      props.updateTransformValues(transformValues);
    }
  }, [transforms]);

  React.useEffect(() => {
    if (props.transformsValues.size > 0) {
      const transformsVal = new Map();
      const transformList = props.transformsValues.get('transforms')?.split(',');
      transformList.forEach((tName, index) => {
        const transformData: ITransformData = { key: Math.random() * 10000 };
        transformData.name = tName;
        transformData.type = props.transformsValues.get(`transforms.${tName}.type`);
        transformData.config = {};
        for (const [key, value] of props.transformsValues.entries()) {
          if (key.includes(tName) && !key.includes('type')) {
            const fieldName = key.split(`transforms.${tName}.`)[1];
            transformData.config[fieldName] = value;
          }
        }
        transformsVal.set(index + 1, transformData);
        setTransforms(transformsVal);
      });
    } else {
      props.setIsTransformDirty(false);
    }
  }, []);

  return (
    <div>
      {transforms.size === 0 ? (
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            {t('noTransformAdded')}
          </Title>
          <EmptyStateBody>
            {t('transformAlert')}
            {' See '}
            <a href="https://debezium.io/documentation/" target="_blank">
              {t('documentation')}
            </a>{' '}
            {t('moreDetails')}
          </EmptyStateBody>
          <Button variant="secondary" className="pf-u-mt-lg" icon={<PlusCircleIcon />} onClick={addTransform}>
            {t('addTransform')}
          </Button>
        </EmptyState>
      ) : (
        <>
          <Alert
            variant="info"
            isInline={true}
            title={
              <p>
                {t('transformAlert')} {' See '}
                <a href="https://debezium.io/documentation/" target="_blank">
                  {t('documentation')}
                </a>{' '}
                {t('moreDetails')}
              </p>
            }
          />
          <Grid>
            <GridItem span={9}>
              {Array.from(transforms.keys()).map((key, index) => {
                return (
                  <TransformCard
                    key={transforms.get(key)?.key}
                    transformNo={key}
                    ref={_items.ref(transforms.get(key)?.key)}
                    transformName={transforms.get(key)?.name || ''}
                    transformType={transforms.get(key)?.type || ''}
                    transformConfig={transforms.get(key)?.config || {}}
                    transformNameList={getNameList()}
                    deleteTransform={deleteTransformCallback}
                    moveTransformOrder={moveTransformOrder}
                    isTop={key === 1}
                    isBottom={key === transforms.size}
                    updateTransform={updateTransformCallback}
                    transformsData={transformResponse}
                    setIsTransformDirty={props.setIsTransformDirty}
                    selectedConnectorType={props.selectedConnectorType}
                  />
                );
              })}
            </GridItem>
          </Grid>
          <Button variant="secondary" className="pf-u-mt-lg pf-u-mr-sm" onClick={saveTransforms}>
            {t('apply')}
          </Button>
          <Button variant="secondary" className="pf-u-mt-lg" icon={<PlusCircleIcon />} onClick={addTransform}>
            {t('addTransform')}
          </Button>
        </>
      )}
    </div>
  );
};
