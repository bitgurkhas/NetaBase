'use client'
import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[] | undefined;
  }
}

type AdBannerTypes = {
  dataAdSlot: string,
  dataAdFormat: string,
  dataFullWidthResponsive: boolean,
}

const AdBanner = ({ dataAdSlot, dataAdFormat, dataFullWidthResponsive }: AdBannerTypes) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      (window.adsbygoogle as unknown[]).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!isClient) {
    return null; // Don't render on server
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-6288230696348205"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
    />
  );
}

export default AdBanner;