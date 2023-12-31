/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionalComponent } from "preact";
import { MappableProp, PropSource } from "../../utils";
import { Property, PropertyProps } from "../atoms/Property";
import { canMapProps } from "../../utils/funcs/getPropsConverter";

type PropertyListProps = {
  list: MappableProp[];
  source: PropSource;
  draggingProp?: PropertyProps;
  onPropertyDragStart: (
    event: DragEvent,
    propData: MappableProp,
    source: PropSource
  ) => void;
  onDropOnProperty: (cmsProp: MappableProp, compProp: MappableProp) => void;
  onPropertyClick: (prop: MappableProp, source: PropSource) => void;
};

export const PropertyList: FunctionalComponent<PropertyListProps> = ({
  list,
  source,
  draggingProp,
  onPropertyDragStart,
  onDropOnProperty,
  onPropertyClick,
}) => {
  const handlePropertyDrop = (event: DragEvent, prop: MappableProp) => {
    event.stopPropagation();
    if (!draggingProp) {
      return;
    }

    let cmsProp: MappableProp = null;
    let compProp: MappableProp = null;
    if (source === PropSource.CMS) {
      cmsProp = prop;
      compProp = draggingProp.propData;
    } else {
      cmsProp = draggingProp.propData;
      compProp = prop;
    }
    onDropOnProperty(cmsProp, compProp);
  };

  return (
    <>
      {list.length ? (
        <ul>
          {list.map((prop) => {
            let isMappable = false;
            const propDepth = prop.name.split(".").length - 1;

            if (draggingProp && draggingProp.source !== source) {
              if (source === PropSource.CMS) {
                isMappable = canMapProps(prop, draggingProp.propData);
              } else if (source === PropSource.COMPONENT) {
                isMappable = canMapProps(draggingProp.propData, prop);
              }
            }

            return (
              <li
                key={prop.name}
                onDrop={
                  isMappable
                    ? (event) => handlePropertyDrop(event, prop)
                    : undefined
                }
                class={`mb-px ${isMappable ? "bg-ui-03 bg-opacity-20" : ""} ${
                  source === PropSource.COMPONENT ? `flex justify-end` : ""
                }`}
                style={`${
                  source === PropSource.COMPONENT
                    ? `margin-right:calc(${propDepth} * .5rem)`
                    : `margin-left:calc(${propDepth} * .5rem)`
                }`}
              >
                <Property
                  propData={prop}
                  source={source}
                  onDragStart={(event) =>
                    onPropertyDragStart(event, prop, source)
                  }
                  onClick={() => onPropertyClick(prop, source)}
                  draggable={true}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          class={`${source === PropSource.COMPONENT ? `flex justify-end` : ""}`}
        >
          No more properties available.
        </p>
      )}
    </>
  );
};
