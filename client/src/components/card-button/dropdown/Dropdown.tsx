import React, { useState } from 'react';
import Select, { components } from 'react-select';

import { useStore } from 'Root/context';
import { SORTBY, SORTORDER } from 'Types/enums';

import './styles.css';

type Option = {
  value: string,
  label: string,
};

const tOptions: Option[] = [
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'type', label: 'Type' },
  { value: 'modified', label: 'Last Modified' },
];

const CheckIcon = () => {
  return (
    <span className='checkicon'>
      <div className='checkicon_tip'></div>
      <div className='checkicon_base'></div>
    </span>
  );
};

const Menu = (props: any) => {
  const store = useStore();

  const [selected, setSelected] = useState<null | SORTORDER>(() => {
    return store.filters.sortOrder || null;
  });

  const handleSortOrder = (order: SORTORDER) => {
    store.filters.sortOrder = order;
    setSelected(order);
  };

  return (
    <>
      <components.Menu {...props}>
        <div>
          <div>{props.children}</div>
          <hr />
          <div>
            <button
              onClick={() => handleSortOrder(SORTORDER.ASC)}
              className='dropdown-button'
            >
              {'Ascending'}
              <div className='dropdown-button_checksection'>
                {selected == SORTORDER.ASC && <CheckIcon />}
              </div>
            </button>
            <button
              onClick={() => handleSortOrder(SORTORDER.DESC)}
              className='dropdown-button'
            >
              {'Descending'}
              <div className='dropdown-button_checksection'>
                {selected == SORTORDER.DESC && <CheckIcon />}
              </div>
            </button>
          </div>
        </div>
      </components.Menu>
    </>
  );
};

export const Dropdown = () => {
  const store = useStore();

  const [selected, setSelected] = useState<Option | null>(() => {
    return tOptions.find((opt) => opt.value === store.filters.sortBy) || null;
  });

  const handleSortType = (type: Option | null) => {
    setSelected(type);
    if (type?.value) {
      store.filters.sortBy = type.value as SORTBY;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Select
        placeholder={'Select'}
        styles={{
          control: (css) => {
            return {
              ...css,
              width: '10rem',
            };
          },
        }}
        closeMenuOnSelect={false}
        options={tOptions}
        defaultValue={selected}
        isSearchable={false}
        onChange={handleSortType}
        components={{ Menu }}
      />
    </div>
  );
};
