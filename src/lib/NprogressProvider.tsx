'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactNode } from 'react';

const NprogressProvider = ({ children }:{
  children: ReactNode;
}) => {
  return (
    <>
      {children}
      <ProgressBar height="4px" color="#15803d" options={{ showSpinner: false }} shallowRouting />
    </>
  );
};

export default NprogressProvider;
