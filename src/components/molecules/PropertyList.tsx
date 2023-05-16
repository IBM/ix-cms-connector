import { FunctionalComponent } from "preact";
import { MappableProp, Source } from "../../utils";
import { Property, PropertyProps } from "../atoms/Property";
import { canMapProps } from "../../utils/funcs/getPropsConverter";

type PropertyListProps = {
  list: MappableProp[];
  source: Source;
  draggingProp?: PropertyProps;
  onPropertyDragStart: (
    event: DragEvent,
    propData: MappableProp,
    source: Source
  ) => void;
  onDropOnProperty: (cmsProp: MappableProp, compProp: MappableProp) => void;
  onPropertyClick: (prop: MappableProp, source: Source) => void;
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
    if (source === Source.CMS) {
      cmsProp = prop;
      compProp = draggingProp.propData;
    } else {
      cmsProp = draggingProp.propData;
      compProp = prop;
    }
    onDropOnProperty(cmsProp, compProp);
  };

  return (
    <ul>
      {list.map((prop) => {
        let isMappable = false;
        if (draggingProp && draggingProp.source !== source) {
          if (source === Source.CMS) {
            isMappable = canMapProps(prop, draggingProp.propData);
          } else if (source === Source.COMPONENT) {
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
              source === Source.COMPONENT ? "flex justify-end" : ""
            }`}
          >
            <Property
              propData={prop}
              source={source}
              onDragStart={(event) => onPropertyDragStart(event, prop, source)}
              onClick={() => onPropertyClick(prop, source)}
              draggable={true}
            />
          </li>
        );
      })}
    </ul>
  );
};
