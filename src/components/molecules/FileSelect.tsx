import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { useDropzone } from "react-dropzone";
import { File } from "../atoms/File";

type FileSelectProps = {
  onSelect: (file: File) => void;
  onRemoveFile?: () => void;
};

export const FileSelect: FunctionComponent<FileSelectProps> = ({
  onSelect,
  onRemoveFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File>(null);
  const handleDrop = (files: File[]) => {
    if (files[0]) {
      setSelectedFile(files[0]);
      onSelect(files[0]);
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    onRemoveFile();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    maxFiles: 1,
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined,
  });
  return selectedFile ? (
    <File
      name={selectedFile.name}
      onRemoveFile={onRemoveFile ? handleRemoveFile : undefined}
    />
  ) : (
    <div
      aria-label="drop area"
      {...getRootProps({
        className: `cursor-pointer h-24 border border-dashed hover:border-interactive-01 hover:bg-highlight ${
          isDragActive ? "border-interactive-01 bg-highlight" : "border-ui-04"
        }`,
      })}
    >
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <input {...getInputProps()} />
      <div class="text-xs px-4 py-2.5 text-link-01">
        Drag and drop a file here or click to upload
      </div>
    </div>
  );
};
