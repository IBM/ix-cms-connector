import { FunctionalComponent } from "preact";
import { useRef, useState } from "preact/hooks";
import { HTMLAttributes } from "react";
import { MappableProp, TSType } from "../../utils";
import { PropertyTag } from "./PropertyTag";

export enum Source {
  CMS,
  COMPONENT,
}

export interface PropertyProps extends HTMLAttributes<HTMLDivElement> {
  source: Source.CMS | Source.COMPONENT;
  propData: MappableProp;
}

export const Property: FunctionalComponent<PropertyProps> = ({
  source,
  propData: { name, type, subTypes, isRequired },
  draggable,
  onClick,
  onDragStart,
}) => {
  const [types] = useState<string[]>(() => {
    const propTypes = [];
    if (type === TSType.Array) {
      for (const subType of subTypes) {
        propTypes.push(`${subType}[]`);
      }
    } else if (type === TSType.Union) {
      for (const subType of subTypes) {
        propTypes.push(subType);
      }
    } else {
      propTypes.push(type);
    }
    return propTypes;
  });
  const propertyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      class="group/property cursor-grab inline-flex relative transition-transform duration-75 ease-linear"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      tabIndex={0}
      ref={propertyRef}
    >
      {source === Source.COMPONENT && (
        <svg
          viewBox="0 0 16 56"
          xmlns="http://www.w3.org/2000/svg"
          class="h-14 fill-ui-01 group-hover/property:fill-highlight"
          role="none"
        >
          <polygon points="0,0 16,0 16,56 0,56 16,28 0,0" />
        </svg>
      )}

      <div class="py-2 px-3 bg-ui-01 group-hover/property:bg-highlight h-fit">
        <div
          class={`mb-1.5 text-sm leading-none font-mono text-text-01 ${
            source === Source.COMPONENT ? "text-right" : ""
          }`}
        >
          {name}
          {isRequired && <sup class="text-text-05 ml-1">*</sup>}
        </div>
        <ul
          class={`flex space-x-2 ${
            source === Source.COMPONENT ? "justify-end" : ""
          }`}
        >
          {types.map((type) => (
            <li key={type} class="flex">
              <PropertyTag label={type} />
            </li>
          ))}
        </ul>
      </div>

      {source === Source.CMS && (
        <svg
          viewBox="0 0 16 56"
          xmlns="http://www.w3.org/2000/svg"
          class="h-14 fill-ui-01 group-hover/property:fill-highlight"
          role="none"
        >
          <polygon points="0,0 16,28 0,56 0,0" />
        </svg>
      )}
    </div>
  );
};
