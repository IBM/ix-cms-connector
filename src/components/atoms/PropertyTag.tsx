/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionalComponent } from "preact";
import { TSType } from "../../utils";

type PropertyTagProps = {
  label: string;
};

const className = {
  [TSType.Boolean]:
    "bg-tag-magenta-background text-tag-magenta-text group-hover/property:bg-tag-magenta-hover",
  [TSType.String]:
    "bg-tag-blue-background text-tag-blue-text group-hover/property:bg-tag-blue-hover",
  [TSType.Number]:
    "bg-tag-green-background text-tag-green-text group-hover/property:bg-tag-green-hover",
  [TSType.Null]:
    "bg-tag-cool-gray-background text-tag-cool-gray-text group-hover/property:bg-tag-cool-gray-hover",
  [TSType.Undefined]:
    "bg-tag-gray-background text-tag-gray-text group-hover/property:bg-tag-gray-hover",
};

export const PropertyTag: FunctionalComponent<PropertyTagProps> = ({
  label,
}) => {
  const style = label.replace("[]", "");
  return (
    <div
      class={`inline-block rounded-full text-xs leading-none px-2 py-1 ${className[style]}`}
    >
      {label}
    </div>
  );
};
