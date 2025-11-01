export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
  children?: FileNode[];
}

export interface AIReviewResult {
  id: string;
  timestamp: Date;
  model: string;
  suggestions: CodeSuggestion[];
  summary: string;
}

export interface CodeSuggestion {
  id: string;
  file: string;
  line: number;
  type: "refactor" | "bug" | "performance" | "security" | "style";
  description: string;
  originalCode: string;
  suggestedCode: string;
  status: "pending" | "accepted" | "rejected";
}

export interface ProjectState {
  name: string;
  files: FileNode[];
  selectedFile: FileNode | null;
  selectedCode: string | null;
  reviews: AIReviewResult[];
}
