import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { FileNode } from "@/types/project";
import { cn } from "../lib/utils";

interface FileTreeProps {
  nodes: FileNode[];
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
}

export const FileTree = ({ nodes, selectedFile, onFileSelect }: FileTreeProps) => {
  return (
    <div className="py-2">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.id}
          node={node}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

interface FileTreeNodeProps {
  node: FileNode;
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  depth?: number;
}

const FileTreeNode = ({
  node,
  selectedFile,
  onFileSelect,
  depth = 0,
}: FileTreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isSelected = selectedFile?.id === node.id;

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary/50 transition-colors text-left",
          isSelected && "bg-secondary"
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {node.type === "folder" && (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0 text-primary" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0 text-primary" />
            )}
          </>
        )}
        {node.type === "file" && (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};