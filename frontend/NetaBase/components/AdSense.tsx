import Script from 'next/script';
import React from 'react'

type AdSenseTypes={
    pId:string;
}

 const AdSense = ({pId}: AdSenseTypes) => {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}

export default AdSense;