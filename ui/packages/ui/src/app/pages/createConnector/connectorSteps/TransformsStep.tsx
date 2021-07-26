import { Alert, Button } from '@patternfly/react-core';
import React from 'react';
import { TransformCard } from './TransformCard';

export const TransformsStep: React.FunctionComponent = () => {
  const [transform, setTransform] = React.useState<Map<number, any>>(new Map<number, any>());
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
        console.log(key);
        if(key>order){
          transformResult.set(+key-1,value);
        }else if(key<order){
          transformResult.set(+key,value)
        }
      }
      setTransform(transformResult);
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
            key={transform.get(key).key}
            transformNo={key}
            transformName={transform.get(key)?.name || ''}
            transformType={transform.get(key)?.type || ''}
            transformConfig={transform.get(key)?.config || {}}
            deleteTransform={deleteTransformCallback}
          />
        );
      })}
      <Button variant="secondary" className="pf-u-mt-lg" onClick={addTransform}>
        Add transform
      </Button>
    </div>
  );
};
