/* eslint-disable max-len */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, {useEffect} from 'react';

import {trello} from 'root/api/client';
import {EditorPayload} from 'components/card-button/types';

import './styles.css';

const cleanup = (id: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  trello.remove('card', 'shared', id);
};

const cleanupOnEvent = (e: MessageEvent<{action: string, id: string}>): void => {
  const {data, isTrusted} = e;

  if (isTrusted && data.action === 'cleanup') {
    cleanup(data.id);
  }
};

const isEditorLoaded = (): boolean => {
  return Boolean((document.getElementById('iframeEditor') as HTMLIFrameElement)?.contentWindow?.length);
};

export function Editor({signature, payload, setError}: {
  signature: string,
  payload: EditorPayload,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
}): JSX.Element {
  const checkEditorLoaded = (): void => {
    if (!isEditorLoaded()) {
      setError(true);
      cleanup(payload.attachment);
    }
  };

  useEffect(() => {
    const form = (document.getElementById('onlyoffice-editor-form') as HTMLFormElement);
    form.action = `${process.env.BACKEND_HOST!}/onlyoffice/editor?signature=${signature}`;
    (document.getElementById('onlyoffice-editor-payload') as HTMLInputElement).value = JSON.stringify(payload);
    form.submit();
    setTimeout(() => {
      checkEditorLoaded();
    }, 8000);

    window.addEventListener('message', cleanupOnEvent);

    return () => {
      window.removeEventListener('message', cleanupOnEvent);
    };
  });

  return (
      <>
          <form
              action=''
              method='POST'
              target='iframeEditor'
              id='onlyoffice-editor-form'
          >
              <input
                  id='onlyoffice-editor-payload'
                  name='payload'
                  value=''
                  type='hidden'
              />
          </form>
          <iframe
              name='iframeEditor'
              id='iframeEditor'
              onLoad={checkEditorLoaded}
          />
      </>
  );
}
