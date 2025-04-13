import React from 'react';
import { redirect } from 'next/navigation';


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-black flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4 max-sm:py-8'>
      {children}
    </div>
  );
};

export default AuthLayout;
