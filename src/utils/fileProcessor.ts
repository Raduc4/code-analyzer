import { FileNode } from "@/types/project";

export const processFiles = async (files: FileList): Promise<FileNode[]> => {
  const fileNodes: FileNode[] = [];
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const content = await readFileContent(file);
    const language = detectLanguage(file.name);

    const node: FileNode = {
      id: crypto.randomUUID(),
      name: file.name,
      path: file.webkitRelativePath || file.name,
      type: "file",
      content,
      language,
    };

    fileNodes.push(node);
  }

  return buildFileTree(fileNodes);
};

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const detectLanguage = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    go: "go",
    rs: "rust",
    rb: "ruby",
    php: "php",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    md: "markdown",
    sql: "sql",
    sh: "bash",
    yaml: "yaml",
    yml: "yaml",
  };
  return languageMap[ext || ""] || "text";
};

const buildFileTree = (files: FileNode[]): FileNode[] => {
  const root: Record<string, FileNode> = {};

  files.forEach((file) => {
    const parts = file.path.split("/");
    let current = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = file;
      } else {
        if (!current[part]) {
          current[part] = {
            id: crypto.randomUUID(),
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            type: "folder",
            children: [],
          };
        }
        if (!current[part].children) {
          current[part].children = [];
        }
        const childMap: Record<string, FileNode> = {};
        current[part].children?.forEach((child) => {
          childMap[child.name] = child;
        });
        current = childMap;
      }
    });
  });

  const convertToArray = (obj: Record<string, FileNode>): FileNode[] => {
    return Object.values(obj).map((node) => {
      if (node.type === "folder" && node.children) {
        const childMap: Record<string, FileNode> = {};
        node.children.forEach((child) => {
          childMap[child.name] = child;
        });
        node.children = convertToArray(childMap);
      }
      return node;
    });
  };

  return convertToArray(root);
};

export const flattenFiles = (nodes: FileNode[]): FileNode[] => {
  const result: FileNode[] = [];

  const traverse = (node: FileNode) => {
    if (node.type === "file") {
      result.push(node);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };

  nodes.forEach(traverse);
  return result;
};
