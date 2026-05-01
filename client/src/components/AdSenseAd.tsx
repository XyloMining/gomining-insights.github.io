import { useEffect } from "react";

interface AdSenseAdProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
}

/**
 * AdSense Ad Component
 * Displays Google AdSense ads with proper formatting
 * 
 * To enable ads:
 * 1. Get your site approved for Google AdSense
 * 2. Add your Google AdSense Publisher ID to environment variables
 * 3. Replace the placeholder slot IDs with your actual AdSense slot IDs
 */
export default function AdSenseAd({
  slot,
  format = "auto",
  responsive = true,
}: AdSenseAdProps) {
  useEffect(() => {
    // Push ads to the Google AdSense queue when component mounts
    try {
      const w = window as any;
      if (w.adsbygoogle) {
        w.adsbygoogle.push({});
      }
    } catch (e) {
      console.log("AdSense not loaded yet");
    }
  }, []);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxx";

  return (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
        }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
