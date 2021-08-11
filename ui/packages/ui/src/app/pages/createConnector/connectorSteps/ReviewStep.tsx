import {
  Button,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Text,
  TextVariants,
  Tooltip
} from '@patternfly/react-core';
import { EyeIcon, EyeSlashIcon, FileDownloadIcon} from '@patternfly/react-icons';
import * as React from 'react';
import { mapToObject, maskPropertyValues } from 'shared';

export interface IReviewStepProps {
  i18nReviewTitle: string;
  i18nReviewMessage: string;
  propertyValues: Map<string, string>;
}

const getJson = (properties, showHiddenFields) => {
  return showHiddenFields ? JSON.stringify(mapToObject(properties), null, 2) : JSON.stringify(maskPropertyValues(mapToObject(properties)), null, 2);
};

export const ReviewStep: React.FC<IReviewStepProps> = props => {
  let timer;
  const [copied, setCopied] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const downloadTooltipRef = React.useRef();
  const showTooltipRef = React.useRef();

  const clipboardCopyFunc = (event, text) => {
    const clipboard = event.currentTarget.parentElement;
    const el = document.createElement('textarea');
    el.value = text.toString();
    clipboard.appendChild(el);
    el.select();
    document.execCommand('copy');
    clipboard.removeChild(el);
  };

  const onClick = (event, text) => {
    if (timer) {
      window.clearTimeout(timer);
      setCopied(false);
    }
    clipboardCopyFunc(event, text);
    setCopied(true);
  };

  const downloadFile = async (event, data) => {
    const downloadJson = event.currentTarget.parentElement;
    const file = 'debeziumConfig.json';
    const json = data;
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = file;
    downloadJson.appendChild(link);
    link.click();
    downloadJson.removeChild(link);
  };

  React.useEffect(() => {
    if (copied === true) {
      timer = window.setTimeout(() => {
        setCopied(false);
        timer = null;
      }, 1000);
    }
  }, [copied]);

  const actions = (
    <React.Fragment>
      <CodeBlockAction>
        <Button
          variant="plain"
          ref={showTooltipRef}
          aria-label="show hidden fields icon"
          onClick={() => setShowPassword(!showPassword)}
        >{showPassword ? <EyeSlashIcon/> : <EyeIcon/>}
        </Button>
        <Tooltip content={<div>{showPassword ? 'Hide password' : 'Show password'}</div>} reference={showTooltipRef} />
      </CodeBlockAction>
      <CodeBlockAction>
        <ClipboardCopyButton
          id="copy-button"
          textId="code-content"
          aria-label="Copy to clipboard"
          onClick={e => onClick(e, getJson(props.propertyValues, showPassword))}
          exitDelay={600}
          maxWidth="110px"
          variant="plain"
        >
          {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
        </ClipboardCopyButton>
      </CodeBlockAction>
      <CodeBlockAction>
        <Button
          variant="plain"
          ref={downloadTooltipRef}
          aria-label="Download icon"
          onClick={e => downloadFile(e, getJson(props.propertyValues, showPassword))}
        >
          <FileDownloadIcon />
        </Button>
        <Tooltip content={<div>Download JSON</div>} reference={downloadTooltipRef} />
      </CodeBlockAction>
    </React.Fragment>
  );

  return (
    <>
      <Text component={TextVariants.h2}>{props.i18nReviewMessage}</Text>
      <CodeBlock actions={actions}>
        <CodeBlockCode id="code-content">{getJson(props.propertyValues, showPassword)}</CodeBlockCode>
      </CodeBlock>
    </>
  );
};
