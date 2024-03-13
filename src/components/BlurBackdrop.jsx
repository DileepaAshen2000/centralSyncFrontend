import * as React from 'react';
import { styled } from '@mui/material/styles';

const Backdrop = styled('div')(({ theme, open }) => ({
  position: 'fixed',
  zIndex: 1,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backdropFilter: open ? 'blur(8px)' : 'none', // Apply blur conditionally
  backgroundColor: open ? 'rgba(255, 255, 255, 0.6)' : 'transparent', // Apply background color conditionally
}));

export default function BackdropBlurComponent({ open, onClick }) {
  return <Backdrop open={open} onClick={onClick} />;
}
