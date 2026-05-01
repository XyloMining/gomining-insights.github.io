import { Button } from "@/components/ui/button";
import { Share2, Twitter, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  excerpt: string;
  url?: string;
}

/**
 * ShareButtons Component
 * Provides social media share buttons for X (Twitter) and Reddit
 */
export default function ShareButtons({ title, excerpt, url = window.location.href }: ShareButtonsProps) {
  // Pre-filled share content for X (Twitter)
  const xShareText = `Check out: "${title}" - ${excerpt} #GoMining #Crypto`;
  const xShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(xShareText)}&url=${encodeURIComponent(url)}`;

  // Pre-filled share content for Reddit
  const redditShareUrl = `https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 py-6 border-t border-b border-border/40">
      <span className="text-sm font-semibold text-foreground">Share:</span>
      
      {/* X (Twitter) Share Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-border/40 hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={() => window.open(xShareUrl, "_blank", "width=550,height=420")}
      >
        <Twitter className="w-4 h-4" />
        <span>X</span>
      </Button>

      {/* Reddit Share Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-border/40 hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={() => window.open(redditShareUrl, "_blank", "width=550,height=420")}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Reddit</span>
      </Button>

      {/* Copy Link Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-border/40 hover:bg-primary/10 hover:text-primary transition-colors ml-auto"
        onClick={() => {
          navigator.clipboard.writeText(url);
          // Optional: Show toast notification
        }}
      >
        <Share2 className="w-4 h-4" />
        <span>Copy Link</span>
      </Button>
    </div>
  );
}
