import * as React from 'react';

import { Grid } from '@mui/material';

export default function BasicButtons() {
  return (
    <Grid container>
      <Grid item bgcolor='primary.light' p={2} xs={12} sm={6} > first</Grid>
      <Grid item bgcolor='primary.light' p={2} xs={12} sm={6} >second</Grid>
      <Grid item bgcolor='primary.light' p={2} xs={12} sm={6} >third</Grid>
      <Grid item bgcolor='primary.light' p={2} xs={12} sm={6} >fourth</Grid> 
    </Grid>
  );
}


