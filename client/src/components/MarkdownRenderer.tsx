import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer Component
 * Converts markdown text to properly formatted HTML
 * Supports: headings, bold, italic, links, lists, code blocks, tables, etc.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = content.replace(/\\n/g, "\n");

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-foreground leading-normal mb-4" {...props} />
          ), // Changed text-muted-foreground to text-foreground and leading-relaxed to leading-normal
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-muted-foreground" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:text-primary/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 text-foreground mb-4 ml-4" {...props} />
          ), // Changed text-muted-foreground to text-foreground
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 text-foreground mb-4 ml-4" {...props} />
          ), // Changed text-muted-foreground to text-foreground
          li: ({ node, ...props }) => (
            <li className="text-foreground" {...props} />
          ), // Changed text-muted-foreground to text-foreground
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code className="bg-card/50 border border-border/40 rounded px-2 py-1 text-sm text-foreground font-mono" {...props} />
            ) : (
              <code className="text-sm text-foreground font-mono" {...props} />
            ), // Changed text-muted-foreground to text-foreground
          pre: ({ node, ...props }: any) => (
            <pre className="bg-card/50 border border-border/40 rounded p-4 overflow-x-auto mb-4" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-foreground mb-4" {...props} />
          ), // Changed text-muted-foreground to text-foreground
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-border/40" {...props} />
          ),
          table: ({ node, ...props }) => (
            <table className="w-full border-collapse border border-border/40 mb-4" {...props} />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-card/50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-border/40" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border/40 px-4 py-2 text-left font-semibold text-foreground" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border/40 px-4 py-2 text-foreground" {...props} />
          ), // Changed text-muted-foreground to text-foreground
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
