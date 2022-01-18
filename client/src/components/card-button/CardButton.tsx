/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {fetchDocsInfo} from 'root/api/handlers/settings';
import {generateDocKeySignature} from 'root/api/handlers/signature';
import {fetchSupportedFiles, getCurrentCard} from 'root/api/handlers/card';
import {getAuth} from 'root/api/handlers/auth';
import {useStore} from 'root/context';

import {Header} from 'components/card-button/header/Header';
import {Info} from 'components/card-button/info/Info';
import {Main} from 'components/card-button/main/Main';
import {Loader} from 'components/card-button/loader/Loader';
import {FileList} from 'components/card-button/file/FileList';
import {Editor} from 'components/card-button/editor/Editor';
import {Error} from 'components/card-button/error/Error';
import {Dropdown} from 'components/card-button/dropdown/Dropdown';

import {Trello} from 'types/trello';
import {
  ProxyPayloadResource,
  EditorPayload,
  DocServerInfo,
  TrelloCard,
} from 'components/card-button/types';

import {getFileExt, isFileEditable} from 'root/utils/file';
import {filterFiles} from 'root/utils/sort';

import './styles.css';

const CardButton = observer(() => {
  const store = useStore();
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState('');
  const [signature, setSignature] = useState('');
  const [currentCard, setCurrentCard] = useState<TrelloCard>();
  const [files, setFiles] = useState<Trello.PowerUp.Attachment[]>([]);
  const [docServerInfo, setDocServerInfo] = useState<DocServerInfo>();
  const [editorPayload, setEditorPayload] = useState<EditorPayload>();

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        setToken(await getAuth());
        setDocServerInfo(await fetchDocsInfo());
        const card = await getCurrentCard();
        setCurrentCard(card);
        setFiles(await fetchSupportedFiles(card.id));
        setIsLoading(false);
      } catch {
        setIsError(true);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  const startEditor = async (attachment: string, filename: string)
    : Promise<void> => {
    if (!isError) {
      const resource: ProxyPayloadResource = {
        to: 'api.trello.com',
        // eslint-disable-next-line max-len
        path: `/1/cards/${currentCard!.id}/attachments/${attachment}/download/${filename}`,
        docsHeader: docServerInfo!.docsHeader,
      };
      try {
        setEditorPayload({
          proxyResource: btoa(
            unescape(encodeURIComponent((JSON.stringify(resource)))),
          ),
          attachment,
          card: currentCard!.id,
          filename,
          token,
          ds: docServerInfo!.docsAddress,
          dsheader: docServerInfo!.docsHeader,
          dsjwt: docServerInfo!.docsJwt,
        });
        const isEditable = isFileEditable(getFileExt(filename));
        setSignature(await generateDocKeySignature(attachment, isEditable));
        setIsEditor(true);
      } catch (e) {
        setIsError(true);
      }
    }
  };

  return (
      <>
          {isError && <Error/>}
          {!isError && (
          <>
              {isEditor && (
              <Editor
                  signature={signature}
                  payload={editorPayload!}
                  setError={setIsError}
              />
              )}
              {!isEditor && (
              <Main>
                  <Header/>
                  <Info/>
                  {isLoading && (
                  <div className='onlyoffice_loader-container'>
                      <Loader/>
                  </div>
                  )}
                  {!isLoading && (
                  <>
                      <div className='file_header'>
                          <h2>Files</h2>
                          <div>
                              <Dropdown/>
                          </div>
                      </div>
                      <FileList
                          files={filterFiles(files, store.card.filters)}
                          openHandler={startEditor}
                      />
                  </>
                  )}
              </Main>
              )}
          </>
          )}
      </>
  );
});

export default CardButton;
