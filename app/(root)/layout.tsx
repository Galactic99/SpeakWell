import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className='bg-black-500'>
        {children}
      </div>
    )
  }

export default RootLayout
