import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileNode } from "@/types/project";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

interface CodeViewerProps {
  file: FileNode;
  onCodeSelect: (code: string) => void;
}

export const CodeViewer = ({ file, onCodeSelect }: CodeViewerProps) => {
  const [selectedText, setSelectedText] = useState("");

  const handleTextSelect = () => {
    const selection = window.getSelection();
    const text = selection?.toString() || "";
    setSelectedText(text);
  };

  const handleChatWithSelection = () => {
    if (selectedText) {
      onCodeSelect(selectedText);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div>
          <h3 className="font-semibold text-sm">{file.name}</h3>
          <p className="text-xs text-muted-foreground">{file.path}</p>
        </div>
        {selectedText && (
          <Button
            onClick={handleChatWithSelection}
            size="sm"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Chat about selection
          </Button>
        )}
      </div>

      <div
        className="flex-1 overflow-auto"
        onMouseUp={handleTextSelect}
        onTouchEnd={handleTextSelect}
      >
        <SyntaxHighlighter
          language={file.language || "text"}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "hsl(var(--code-bg))",
            fontSize: "0.875rem",
          }}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: "hsl(var(--muted-foreground))",
            userSelect: "none",
          }}
        >
          {file.content || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};