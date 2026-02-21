import { styled } from '@mui/material/styles';
import Button, { type ButtonProps } from '@mui/material/Button';
import type { ElementType } from 'react';

type NavButtonProps = Omit<ButtonProps, 'component'> & {
  component?: ElementType;
  to?: string;
};

export const NavButton = styled(Button)<NavButtonProps>(({ theme }) => ({
  minHeight: 'var(--tapMinSize)',
  borderRadius: 12,
  padding: '0.5rem 0.875rem',
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  whiteSpace: 'normal',
  textAlign: 'center',
  lineHeight: 1.2,
  overflowWrap: 'anywhere',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(42,171,238,0.12)'
        : 'rgba(42,171,238,0.08)',
    borderColor: theme.palette.primary.main,
  },
  '&:focus-visible': {
    outline: '3px solid var(--focusRing)',
    outlineOffset: 2,
  },
}));
