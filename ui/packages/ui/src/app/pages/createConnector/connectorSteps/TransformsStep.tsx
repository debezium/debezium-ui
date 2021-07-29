import { Alert, Button } from '@patternfly/react-core';
import React from 'react';
import { TransformCard } from 'components';

export interface ITransformData {
  key: number;
  name?: string;
  type?: string;
  config?: any;
}

export const TransformsStep: React.FunctionComponent = () => {
  const [transform, setTransform] = React.useState<Map<number, ITransformData>>(new Map<number, ITransformData>());
  const addTransform = () => {
    const transformCopy = new Map(transform);
    transformCopy.set(transformCopy.size + 1, {key:Math.random()*10000});
    setTransform(transformCopy);
  };

  const deleteTransformCallback = React.useCallback(
    order => {
      const transformCopy = new Map(transform);
      transformCopy.delete(order);
      const transformResult = new Map<number, any>();
      for (const [key, value] of transformCopy.entries()) {
        if(key>order){
          transformResult.set(+key-1,value);
        }else if(key<order){
          transformResult.set(+key,value)
        }
      }
      setTransform(transformResult);
    },[transform]
  );


  const moveTransformOrder = React.useCallback(
    (order,position) => {
      const transformCopy = new Map<number,ITransformData>(transform);
        switch (position){
          case "top":
            transformCopy.set(1,transform.get(order)!)
            let i = 1;
            while (i < order){
              transformCopy.set(i+1,transform.get(i)!)
              i++;
            }
            break;
          case "up":
            transformCopy.set(order-1,transform.get(order)!)
            transformCopy.set(order,transform.get(order-1)!)
            break;
          case "down":
            transformCopy.set(order+1,transform.get(order)!)
            transformCopy.set(order,transform.get(order+1)!)
            break;
          case "bottom":
            transformCopy.set(transform.size,transform.get(order)!)
            let j = transform.size;
            while (j > order){
              transformCopy.set(j-1,transform.get(j)!)
              j--;
            }
            break;
          default:
            break;
        }
      setTransform(transformCopy);
    },[transform]
  );

  return (
    <div>
      <Alert
        variant="info"
        isInline={true}
        title="Transformations enable single message at a time modification. See documentation for more details."
      />
      {Array.from(transform.keys()).map((key,index) => {
        return (
          <TransformCard
            key={transform.get(key)?.key}
            transformNo={key}
            transformName={transform.get(key)?.name || ''}
            transformType={transform.get(key)?.type || ''}
            transformConfig={transform.get(key)?.config || {}}
            deleteTransform={deleteTransformCallback}
            moveTransformOrder={moveTransformOrder}
            isTop={key === 1}
            isBottom={key === transform.size}
          />
        );
      })}
      <Button variant="secondary" className="pf-u-mt-lg" onClick={addTransform}>
        Add transform
      </Button>
    </div>
  );
};
