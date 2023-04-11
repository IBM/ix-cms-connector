import { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { useDropzone } from "react-dropzone";

interface FileSelectProps {
  onSelect: (file: File) => void;
}

const FileSelect: FunctionComponent<FileSelectProps> = ({ onSelect }) => {
  const handleSelectedFiles = useCallback(
    (files: File[]) => {
      onSelect(files[0]);
    },
    [onSelect]
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    multiple: false,
    onDrop: handleSelectedFiles,
  });

  return (
    <div
      {...getRootProps({
        className:
          "flex justify-center rounded border-2 border-indigo-500 p-16 font-semibold hover:bg-indigo-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200",
      })}
    >
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileSelect;
