import { FunctionalComponent } from "preact";
import { Link, Unlink } from "@carbon/icons-react";

type UnlinkPropertiesProps = {
  onClick: () => void;
};

export const UnlinkProperties: FunctionalComponent<UnlinkPropertiesProps> = ({
  onClick,
}) => {
  return (
    <button
      class="group/unlink translate-x-1 relative z-10 -mx-4 hover:mx-2 focus:mx-2 active:mx-5 px-2 transition-all duration-150 ease-out flex h-full items-center"
      onClick={onClick}
    >
      <div class="text-focus scale-50 origin-center transition-all duration-150 group-hover/unlink:delay-75 group-hover/unlink:scale-100 group-focus/unlink:scale-100 opacity-0 group-hover/unlink:opacity-100 group-focus/unlink:opacity-100">
        <Link class="group-active/unlink:hidden" />
        <Unlink class="group-active/unlink:block hidden" />
      </div>
    </button>
  );
};
