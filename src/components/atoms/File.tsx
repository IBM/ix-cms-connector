import { Spinner } from "./Spinner";
import { Close, CheckmarkFilled } from "@carbon/icons-react";

type FileProps = {
  name: string;
  label?: string;
  isLoading?: boolean;
  onRemoveFile?: () => void;
};

export const File = ({
  name,
  label,
  isLoading = false,
  onRemoveFile,
}: FileProps) => {
  const isClickable = onRemoveFile !== undefined;

  return (
    <div class="flex flex-col">
      {!!label && (
        <label class="text-text-02 font-normal text-xs mb-2">{label}</label>
      )}
      <div class="flex items-center p-3.5 text-text-01 bg-ui-shell-white">
        <div class="flex-1 text-sm">{name}</div>
        <div class="flex-shrink-0 flex items-center">
          {!!isLoading && <Spinner />}
          {!isLoading && isClickable && (
            <button
              onClick={onRemoveFile}
              class="focus:outline focus:outline-2 focus:outline-interactive-01"
            >
              <Close />
            </button>
          )}
          {!isLoading && !isClickable && (
            <CheckmarkFilled
              aria-live="polite"
              role="status"
              class="fill-interactive-01"
            />
          )}
        </div>
      </div>
    </div>
  );
};
