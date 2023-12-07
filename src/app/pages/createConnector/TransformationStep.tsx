
// import { Alert, Grid, GridItem, Button, Modal, ModalVariant, Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
// import { CubesIcon, PlusCircleIcon } from '@patternfly/react-icons';
// import React from 'react';
// import { getOptions } from 'tsconfig-paths-webpack-plugin/lib/options';

// interface TransformationStepProps {
//     formData: Record<string,string>;
//     updateFormData: (formData: Record<string, string>) => void;
//     isCustomPropertiesDirty: boolean;
//     updateCustomFormDirty: (isDirty: boolean) => void;
// }

// const TransformationStep: React.FC<TransformationStepProps> = ({formData,updateFormData,isCustomPropertiesDirty,updateCustomFormDirty}) => {
//     const [transforms, setTransforms] = React.useState<
//     Map<string, Record<string,any>>
//   >(new Map<string, Record<string,any>>());

//   const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);


//   const addTransform = () => {
//     const transformsCopy = new Map(transforms);
//     transformsCopy.set(self.crypto.randomUUID(), {
//       name: "",
//       config: {},
//     });
//     setTransforms(transformsCopy);
//     // props.setIsTransformDirty(true);
//   };

//   const deleteTransformCallback = React.useCallback(
//     (id: string) => {
//       const transformsCopy = new Map(transforms);
//       transformsCopy.delete(id);
//       const transformResult = new Map<number, any>();
//       if (transforms.size > 1) {
//         // for (const [key, value] of transformsCopy.entries()) {
//         //   if (key > order) {
//         //     transformResult.set(+key - 1, value);
//         //   } else if (key < order) {
//         //     transformResult.set(+key, value);
//         //   }
//         // }
//         // props.setIsTransformDirty(true);
//         setTransforms(transformsCopy);
//       } else {
//         setIsModalOpen(true);
//       }
//     },
//     [transforms]
//   );

//   const clearTransform = () => {
//     setTransforms(new Map());
//     // props.updateTransformValues(new Map());
//     // props.setIsTransformDirty(false);
//     handleModalToggle();
//   };

//   const saveTransforms = () => {
//     const cardsValid: any[] = [];
//     // nameTypeCheckRef.map.forEach((input: any) => {
//     //   cardsValid.push(input.check());
//     // });

//     // Promise.all(cardsValid).then(
//     //   (d) => {
//     //     props.setIsTransformDirty(false);
//     //   },
//     //   (e) => {
//     //     props.setIsTransformDirty(true);
//     //   }
//     // );
//   };

//   const getNameList = (): string[] => {
//     const nameList: string[] = [];
//     transforms.forEach((val) => {
//       val.name && nameList.push(val.name);
//     });
//     return nameList;
//   };


//   const handleModalToggle = () => {
//     setIsModalOpen(!isModalOpen);
//   };


//   const updateTransformCallback = React.useCallback(
//     (key: string, field: string, value: any) => {
//       const transformsCopy = new Map(transforms);
//       const transformCopy = transforms.get(key);
//       if (field === 'name') {
//         transformCopy![field] = value;
//         // props.setIsTransformDirty(true);
//         transformsCopy.set(key, transformCopy!);
//       } else {
//         transformCopy!.config[field] = value;
//         transformsCopy.set(key, transformCopy!);
//         // saveTransform(transformsCopy);
//       }
//       setTransforms(transformsCopy);
//     },
//     [transforms]
//   );

//   const saveTransform = (data: Map<string, any>) => {
//     const transformValues = new Map();
//     // data.forEach((val) => {
//     //   if (val.name && val.type) {
//     //     transformValues.has('transforms')
//     //       ? transformValues.set(
//     //           'transforms',
//     //           transformValues.get('transforms') + ',' + val.name
//     //         )
//     //       : transformValues.set('transforms', val.name);
//     //     transformValues.set(`transforms.${val.name}.type`, val.type);
//     //     for (const [key, value] of Object.entries(val.config)) {
//     //       transformValues.set(`transforms.${val.name}.${key}`, value);
//     //     }
//     //   }
//     // });
//     // props.updateTransformValues(transformValues);
//   };

//   return (
//     // Add your JSX code here
//     <div>
//     {transforms.size === 0 ? (
//       <Bullseye>
//       <EmptyState variant={EmptyStateVariant.lg}>
//         <EmptyStateIcon icon={CubesIcon} />
//         <Title headingLevel="h4" size="lg">
//           Custom properties
//         </Title>
//         <EmptyStateBody>
//           Configure the custom property for the selected connector type.
//         </EmptyStateBody>
//         <Button
//           variant="secondary"
//           className="pf-u-mt-lg"
//           icon={<PlusCircleIcon />}
//           onClick={addTransform}
//         >
//           Configure custom properties
//         </Button>
//       </EmptyState>
//     </Bullseye>
//     ) : (
//       <>
//         <Grid>
//           <GridItem span={9}>
//             {Array.from(transforms.keys()).map((key, index) => {
//               return (
//                 <TransformCard
//                   key={key}
//                   transformNo={index}
//                 //   ref={nameTypeCheckRef.ref(transforms.get(key)?.key)}
//                 //   transformName={transforms.get(key)?.name || ''}
//                 //   transformType={transforms.get(key)?.type || ''}
//                 //   transformConfig={transforms.get(key)?.config || {}}
//                 transformData={transforms.get(key)}
//                   transformNameList={getNameList()}
//                   deleteTransform={deleteTransformCallback}
//                   moveTransformOrder={moveTransformOrder}
//                   isTop={key === 1}
//                   isBottom={key === transforms.size}
//                   updateTransform={updateTransformCallback}
//                   transformsOptions={getOptions(
//                     responseData,
//                     props.selectedConnectorType
//                   )}
//                   transformsData={responseData}
//                   setIsTransformDirty={props.setIsTransformDirty}
//                 />
//               );
//             })}
//           </GridItem>
//         </Grid>
//         <Button
//           variant="secondary"
//           className="pf-u-mt-lg pf-u-mr-sm"
//           onClick={saveTransforms}
//         >
//           Apply
//         </Button>
//         <Button
//           variant="secondary"
//           className="pf-u-mt-lg"
//           icon={<PlusCircleIcon />}
//           onClick={addTransform}
//         >
//           Add transform
//         </Button>
//       </>
//     )}
//     <Modal
//       variant={ModalVariant.small}
//       title="Delete transform"
//       isOpen={isModalOpen}
//       onClose={handleModalToggle}
//       actions={[
//         <Button key="confirm" variant="primary" onClick={clearTransform}>
//           Confirm
//         </Button>,
//         <Button key="cancel" variant="link" onClick={handleModalToggle}>
//           Cancel
//         </Button>,
//       ]}
//     >
//       Delete transform
//     </Modal>
//   </div>
//   );
// };

// export default TransformationStep;
