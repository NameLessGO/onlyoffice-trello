import React from 'react';

import {File} from 'components/card-button/file/File';

import {Trello} from 'types/trello';
import {OpenHandler} from 'components/card-button/file/types';

import './styles.css';

const scroll = (): void => {
  // eslint-disable-next-line max-len
  setTimeout(() => document.getElementById('onlyoffice-file-container')?.scrollTo({
    top: 0,
    behavior: 'smooth',
  }), 400);
};

export function FileList({files, openHandler}: {
    files: Trello.PowerUp.Attachment[],
    openHandler: OpenHandler,
}): JSX.Element {
  scroll();
  return (
      <div
          className='file_container'
          id='onlyoffice-file-container'
      >
          {files.map((file) => (
              <File
                  key={file.id}
                  file={file}
                  openHandler={openHandler}
              />
          ))}
      </div>
  );
}
