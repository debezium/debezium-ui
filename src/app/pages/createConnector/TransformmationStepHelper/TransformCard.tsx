// import { Split, SplitItem, Tooltip, Dropdown, Title, TextContent, TextVariants, Button, Grid, GridItem, ExpandableSection, DropdownItem } from '@patternfly/react-core';
// import { DropdownToggle } from '@patternfly/react-core/dist/esm/deprecated/components/Dropdown';
// import { GripVerticalIcon, CheckCircleIcon, ExclamationCircleIcon, TrashIcon } from '@patternfly/react-icons';
// import React from 'react';
// import { Form } from 'react-router-dom';

// interface TransformCardProps {
//   // Define the props for the TransformCard component here
// }

// const TransformCard: React.FC<TransformCardProps> = (props) => {
//     const [isOpen, setIsOpen] = React.useState<boolean>(false);
//     const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

//     const [nameIsValid, setNameIsValid] = React.useState<boolean>(true);
//     const [typeIsThere, setTypeIsThere] = React.useState<boolean>(true);

//     const [submitted, setSubmitted] = React.useState<boolean>(false);
//     const [configComplete, setConfigComplete] = React.useState<boolean>(false);


//     const onToggle = (isExpandedVal: boolean) => {
//         setIsExpanded(isExpandedVal);
//       };
  
//       const deleteCard = () => {
//         props.deleteTransform(props.transformNo);
//       };
  
//       // tslint:disable-next-line: no-shadowed-variable
//       const onPositionToggle = (isOpenVal) => {
//         setIsOpen(isOpenVal);
//       };
  
//       const onPositionSelect = (event) => {
//         setIsOpen(!isOpen);
//         props.moveTransformOrder(props.transformNo, event.currentTarget.id);
//         onFocus();
//       };


//       const configRef =
//       React.useRef() as React.MutableRefObject<IConfigValidationRef>;

//     React.useImperativeHandle(ref, () => ({
//       check() {
//         const validPromise = new Promise((resolve, reject) => {
//           if (!props.transformName) {
//             setNameIsValid(false);
//             setConfigComplete(false);
//             reject('fail');
//           } else if (nameIsValid && props.transformType) {
//             configRef?.current!.validate().then(
//               (d) => {
//                 resolve('done');
//               },
//               (e) => {
//                 reject('fail');
//               }
//             );
//           } else if (!props.transformType) {
//             setTypeIsThere(false);
//             reject('fail');
//           }
//         });
//         setSubmitted(true);
//         return validPromise;
//       },
//     }));

//     const isConfigComplete = React.useCallback((val) => {
//       setConfigComplete(val);
//     }, []);

//       const dropdownItems = [
//         <DropdownItem
//           key="move_top"
//           component="button"
//           id="top"
//           isDisabled={props.isTop}
//         >
//           {t('moveTop')}
//         </DropdownItem>,
//         <DropdownItem
//           key="move_up"
//           component="button"
//           id="up"
//           isDisabled={props.isTop || (props.isTop && props.isBottom)}
//         >
//           {t('moveUp')}
//         </DropdownItem>,
//         <DropdownItem
//           key="move_down"
//           component="button"
//           id="down"
//           isDisabled={(props.isTop && props.isBottom) || props.isBottom}
//         >
//           {t('moveDown')}
//         </DropdownItem>,
//         <DropdownItem
//           key="move_bottom"
//           component="button"
//           id="bottom"
//           isDisabled={props.isBottom}
//         >
//           {t('moveBottom')}
//         </DropdownItem>,
//       ];

//   return (
//     <Split>
//                 <SplitItem className={'pf-u-pr-sm'}>
//                   <Tooltip content={<div>{t('reorderTransform')}</div>}>
//                     <Dropdown
//                       className={'position_toggle'}
//                       onSelect={onPositionSelect}
//                       isOpen={isOpen}
//                       isPlain={true}
//                       dropdownItems={dropdownItems}
//                       toggle={
//                         <DropdownToggle
//                           toggleIndicator={null}
//                           onToggle={onPositionToggle}
//                           aria-label="Applications"
//                           id="transform-order-toggle"
//                         >
//                           <GripVerticalIcon />
//                         </DropdownToggle>
//                       }
//                     />
//                   </Tooltip>
//                 </SplitItem>
//                 <SplitItem isFilled={true}>
//                   <Split>
//                     <SplitItem>
//                       <Title headingLevel="h2">
//                         Transformation # {props.transformNo} &nbsp;
//                         {configComplete && (
//                           <CheckCircleIcon style={{ color: '#3E8635' }} />
//                         )}
//                         {submitted && !configComplete && (
//                           <ExclamationCircleIcon style={{ color: '#C9190B' }} />
//                         )}
//                       </Title>
//                     </SplitItem>
//                     <SplitItem isFilled></SplitItem>

//                     <SplitItem className={'pf-u-pr-lg'}>
//                       {props.transformType && (
//                         <TextContent>
//                           <Text component={TextVariants.small}>
//                             See example of &nbsp;
//                             <Button
//                               variant="link"
//                               isInline
//                               onClick={() => setIsDetailModalOpen(true)}
//                             >
//                               <i>
//                                 {
//                                   props.transformType.split('.')[
//                                     props.transformType.split('.').length - 1
//                                   ]
//                                 }{' '}
//                                 transform
//                               </i>
//                             </Button>
//                           </Text>
//                         </TextContent>
//                       )}
//                     </SplitItem>
//                   </Split>

//                   <Form>
//                     <Grid hasGutter={true}>
//                       <GridItem span={4}>
//                         <NameInputField
//                           label="Name"
//                           description={t('transformNameDescription')}
//                           fieldId="transform_name"
//                           isRequired={true}
//                           name="transform_name"
//                           placeholder="Name"
//                           inputType="text"
//                           value={props.transformName}
//                           setFieldValue={updateNameType}
//                           isInvalid={!nameIsValid}
//                           invalidText={
//                             props.transformName
//                               ? t('uniqueName')
//                               : t('nameRequired')
//                           }
//                         />
//                       </GridItem>

//                       <GridItem span={8}>
//                         <TypeSelectorComponent
//                           label="Type"
//                           description={t('transformTypeDescription')}
//                           fieldId="transform_type"
//                           isRequired={true}
//                           isDisabled={props.transformName === ''}
//                           options={props.transformsOptions}
//                           value={props.transformType}
//                           setFieldValue={updateNameType}
//                           isInvalid={!typeIsThere}
//                           invalidText={t('typeRequired')}
//                         />
//                       </GridItem>
//                     </Grid>
//                   </Form>
//                   {props.transformType && (
//                     <ExpandableSection
//                       toggleText={
//                         isExpanded ? t('hideConfig') : t('showConfig')
//                       }
//                       onToggle={onToggle}
//                       isExpanded={isExpanded}
//                     >
//                       <TransformConfig
//                         ref={configRef}
//                         transformConfigOptions={getFormattedConfig(
//                           props.transformsData,
//                           props.transformType
//                         )}
//                         transformConfigValues={props.transformConfig}
//                         updateTransform={props.updateTransform}
//                         transformNo={props.transformNo}
//                         setIsTransformDirty={props.setIsTransformDirty}
//                         transformType={props.transformType}
//                         setConfigComplete={isConfigComplete}
//                       />
//                     </ExpandableSection>
//                   )}
//                 </SplitItem>
//                 <SplitItem>
//                   <Tooltip content={<div>{t('deleteTransform')}</div>}>
//                     <Button
//                       variant="link"
//                       icon={<TrashIcon />}
//                       onClick={deleteCard}
//                       id="tooltip-selector"
//                     />
//                   </Tooltip>
//                 </SplitItem>
//               </Split>
//   );
// };

// export default TransformCard;
