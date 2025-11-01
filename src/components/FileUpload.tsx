import { useCallback } from "react";
import { Upload, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface FileUploadProps {
  onFilesSelect: (files: FileList) => void;
}

export const FileUpload = ({ onFilesSelect }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const items = Array.from(e.dataTransfer.items);
      const files: File[] = [];

      const processEntries = async () => {
        for (const item of items) {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await traverseFileTree(entry, files, "");
          }
        }

        if (files.length > 0) {
          const fileList = createFileList(files);
          onFilesSelect(fileList);
        }
      };

      processEntries();
    },
    [onFilesSelect]
  );

  const traverseFileTree = async (
    entry: FileSystemEntry,
    files: File[],
    path: string
  ): Promise<void> => {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      const file = await new Promise<File>((resolve) => {
        fileEntry.file(resolve);
      });
      // Set the relative path for the file
      const relativePath = path ? `${path}/${file.name}` : file.name;
      Object.defineProperty(file, "webkitRelativePath", {
        value: relativePath,
        writable: false,
      });
      files.push(file);
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const reader = dirEntry.createReader();

      console.log(dirEntry);

      // Read all entries (may need multiple calls for large directories)
      const readAllEntries = async (): Promise<FileSystemEntry[]> => {
        const allEntries: FileSystemEntry[] = [];
        let entries: FileSystemEntry[];

        do {
          entries = await new Promise<FileSystemEntry[]>((resolve) => {
            reader.readEntries(resolve);
          });
          allEntries.push(...entries);
        } while (entries.length > 0);

console.log(allEntries);
        return allEntries;
      };

      const entries = await readAllEntries();
      const newPath = path ? `${path}/${entry.name}` : entry.name;

      // Recursively process all entries in the directory
      for (const childEntry of entries) {
        await traverseFileTree(childEntry, files, newPath);
      }
    }
  };

  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelect(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <Card
        className="w-full max-w-2xl p-12 border-2 border-dashed border-border hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="p-6 rounded-full bg-secondary">
            <Upload className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Upload Your Project</h2>
            <p className="text-muted-foreground">
              Drag and drop a project folder here, or click to browse
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild size="lg" className="gap-2">
              <label className="cursor-pointer">
                <FolderOpen className="w-5 h-5" />
                Select Folder
                <input
                  type="file"
                  className="hidden"
                  {...({ webkitdirectory: "" } as any)}
                  multiple
                  onChange={handleFolderSelect}
                />
              </label>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Supported: All text-based source code files
          </p>
        </div>
      </Card>
    </div>
  );
};
