/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionalComponent } from "preact";
import { useRef, useState } from "preact/hooks";
import { HTMLAttributes } from "react";
import { MappableProp, PropSource, formatMappablePropType } from "../../utils";
import { PropertyTag } from "./PropertyTag";
import { PropertyArrowComponent } from "./PropertyArrowComponent";
import { PropertyArrowCms } from "./PropertyArrowCms";

export interface PropertyProps extends HTMLAttributes<HTMLDivElement> {
  source: PropSource.CMS | PropSource.COMPONENT;
  propData: MappableProp;
}

export const Property: FunctionalComponent<PropertyProps> = ({
  source,
  propData,
  draggable,
  onClick,
  onDragStart,
}) => {
  const [types] = useState<string[]>(() => formatMappablePropType(propData));
  const propertyRef = useRef<HTMLDivElement>(null);
  const { name, isRequired } = propData;

  return (
    <div
      class="group/property cursor-grab inline-flex relative transition-transform duration-75 ease-linear"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      tabIndex={0}
      ref={propertyRef}
    >
      {source === PropSource.COMPONENT && <PropertyArrowComponent />}

      <div class="py-2 px-3 bg-ui-01 group-hover/property:bg-highlight h-fit">
        <div
          class={`mb-1.5 text-sm leading-none font-mono text-text-01 ${
            source === PropSource.COMPONENT ? "text-right" : ""
          }`}
        >
          {name}
          {isRequired && <sup class="text-text-05 ml-1">*</sup>}
        </div>
        <ul
          class={`flex space-x-2 ${
            source === PropSource.COMPONENT ? "justify-end" : ""
          }`}
        >
          {types.map((type) => (
            <li key={type} class="flex">
              <PropertyTag label={type} />
            </li>
          ))}
        </ul>
      </div>

      {source === PropSource.CMS && <PropertyArrowCms />}
    </div>
  );
};
