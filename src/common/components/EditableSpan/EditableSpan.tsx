import { type ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import type { RequestStatus } from '@/common/types/types.ts';

type Props = {
  value: string;
  onChange: (title: string) => void;
  entityStatus?: RequestStatus;
};
export const EditableSpan = ({ value, onChange, entityStatus }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState(value);
  const disabled = entityStatus === 'loading';
  const turnOnEditMode = () => {
    if (disabled) return;
    setIsEditMode(true);
  };
  const turnOffEditMode = () => {
    setIsEditMode(false);
    onChange(title);
  };
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <>
      {isEditMode ? (
        <TextField
          variant={'outlined'}
          value={title}
          size={'small'}
          onChange={changeTitle}
          onBlur={turnOffEditMode}
          autoFocus
        />
      ) : (
        <span onDoubleClick={turnOnEditMode}>{value}</span>
      )}
    </>
  );
};
