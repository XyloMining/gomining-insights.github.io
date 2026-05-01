import { Info } from "lucide-react";

/**
 * Ad Disclaimer Component
 * Displays a minimal, non-intrusive disclaimer about ads supporting the website
 */
export default function AdDisclaimer() {
  return (
    <div className="bg-card/30 border border-border/40 rounded-lg p-4 my-8 flex gap-3 items-start">
      <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="text-sm text-muted-foreground">
        <p>
          This website displays ads to help us keep the service running and provide you with free, high-quality crypto market insights. We appreciate your understanding.
        </p>
      </div>
    </div>
  );
}
