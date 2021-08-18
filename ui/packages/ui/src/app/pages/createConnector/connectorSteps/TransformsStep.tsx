import { Alert, Button } from '@patternfly/react-core';
import React from 'react';
import { TransformCard } from 'components';
import transformResponse from '../../../../../assets/mockResponse/transform.json';
import { IValidationRef } from '..';

export interface ITransformData {
  key: number;
  name?: string;
  type?: string;
  config?: any;
}

// tslint:disable-next-line: no-empty-interface
export interface ITransformStepProps {
  transformsValues: Map<string, any>;
  updateTransformValues: (data: any) => void;
}

export const TransformsStep: React.FunctionComponent<ITransformStepProps> = props => {
  const [transforms, setTransforms] = React.useState<Map<number, ITransformData>>(new Map<number, ITransformData>());

  const transformSaveRef = React.useRef() as React.MutableRefObject<IValidationRef>;

  const addTransform = () => {
    const transformsCopy = new Map(transforms);
    transformsCopy.set(transformsCopy.size + 1, { key: Math.random() * 10000, config: {} });
    setTransforms(transformsCopy);
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
    },
    [transforms]
  );

  const saveTransforms = () => {
    console.log('saved');
    transformSaveRef?.current?.validate();
  };

  const updateTransformCallback = React.useCallback(
    (key: number, field: string, value: any) => {
      const transformsCopy = new Map(transforms);
      const transformCopy = transforms.get(key);
      if (field === 'name' || field === 'type') {
        transformCopy![field] = value;
      } else {
        transformCopy!.config = value;
      }
      transformsCopy.set(key, transformCopy!);
      setTransforms(transformsCopy);
      console.log('transform set',transformsCopy);
    },
    [transforms]
  );

  React.useEffect(()=>{
    if(transforms.size > 0){
      const transformValues = new Map();
      transforms.forEach((val)=>{
        transformValues.has('transforms') ? transformValues.set('transforms',transformValues.get('transforms')+','+val.name) : transformValues.set('transforms',val.name);
        transformValues.set(`transforms.${val.name}.type`,val.type);
        for(const [key, value] of Object.entries(val.config)){
          transformValues.set(`transforms.${val.name}.${key}`,value);
        }
      })
      props.updateTransformValues(transformValues);
      console.log('data',transformValues)
    }
    
  },[transforms]);

  React.useEffect(() => {
    if(props.transformsValues.size > 0){
      const transformsVal = new Map();
      const transformList = props.transformsValues.get('transforms')?.split(',')
      transformList.forEach((tName,index) => {
        const transformData:ITransformData  = {key: Math.random() * 10000};
        transformData.name = tName;
        transformData.type = props.transformsValues.get(`transforms.${tName}.type`);
        transformData.config = {};
        for (const [key, value] of props.transformsValues.entries()) {
          if(key.includes(tName) && !key.includes('type')){
            const fieldName = key.split('.')[key.split('.').length-1]
            transformData.config[fieldName] = value;
          }
        }
        transformsVal.set(index+1,transformData);
        setTransforms(transformsVal)
      });
    }
  }, []);

  return (
    <div>
      <Alert
        variant="info"
        isInline={true}
        title="Transformations enable single message at a time modification. See documentation for more details."
      />
      {Array.from(transforms.keys()).map((key, index) => {
        return (
          <TransformCard
            key={transforms.get(key)?.key}
            transformNo={key}
            ref={transformSaveRef}
            transformName={transforms.get(key)?.name || ''}
            transformType={transforms.get(key)?.type || ''}
            transformConfig={transforms.get(key)?.config || {}}
            deleteTransform={deleteTransformCallback}
            moveTransformOrder={moveTransformOrder}
            isTop={key === 1}
            isBottom={key === transforms.size}
            updateTransform={updateTransformCallback}
            transformsData={transformResponse}
          />
        );
      })}
      {transforms.size !== 0 && (
        <Button variant="primary" className="pf-u-mt-lg pf-u-mr-md" onClick={saveTransforms}>
          Save
        </Button>
      )}
      <Button variant="secondary" className="pf-u-mt-lg" onClick={addTransform}>
        Add transform
      </Button>
    </div>
  );
};
