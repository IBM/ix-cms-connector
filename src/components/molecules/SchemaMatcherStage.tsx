import { FunctionComponent } from "preact";
import { StagedProp } from "../../reducers/stagedPropsReducer";
import { Property, PropertyProps } from "../atoms/Property";
import { MappableProp, Source } from "../../utils";
import { UnlinkProperties } from "../atoms/UnlinkProperties";
import { canMapProps } from "../../utils/funcs/getPropsConverter";

type SchemaMatcherStageProps = {
  stagedProps: StagedProp[];
  draggingProp: PropertyProps | null;
  onDropOnStage: (propData: MappableProp, source: Source) => void;
  onDropOnPropery: (
    cmsProp: MappableProp,
    compProp: MappableProp,
    index: number
  ) => void;
  onPropertyDragStart: (
    event: DragEvent,
    propData: MappableProp,
    source: Source
  ) => void;
  onPropertyClick: (propData: MappableProp, source: Source) => void;
  onUnlinkClick: (cmsProp: MappableProp, compProp: MappableProp) => void;
};

export const SchemaMatcherStage: FunctionComponent<SchemaMatcherStageProps> = ({
  stagedProps,
  draggingProp,
  onDropOnStage,
  onDropOnPropery,
  onPropertyDragStart,
  onPropertyClick,
  onUnlinkClick,
}) => {
  return (
    <div
      class="py-6 my-6 border border-dashed border-ui-03 relative"
      onDrop={(event) => {
        event.stopPropagation();
        if (draggingProp) {
          onDropOnStage(draggingProp.propData, draggingProp.source);
        }
      }}
    >
      <p class="absolute top-0 left-0 text-xs px-4 py-2.5 text-text-05">
        Map properties
      </p>
      <ul>
        {stagedProps.map(([cmsProp, compProp], index) => {
          let isMappable = false;
          if (draggingProp?.source === Source.CMS) {
            isMappable =
              !!compProp && canMapProps(draggingProp.propData, compProp);
          } else if (draggingProp?.source === Source.COMPONENT) {
            isMappable =
              !!cmsProp && canMapProps(cmsProp, draggingProp.propData);
          }

          return (
            <li
              key={`map-${cmsProp?.name || "__"}-to-${compProp?.name || "__"}`}
              class={`mb-px flex h-14 ${
                isMappable ? "bg-ui-03 bg-opacity-20" : ""
              }`}
              onDrop={
                isMappable
                  ? (event) => {
                      event.stopPropagation();
                      if (draggingProp.source === Source.CMS) {
                        onDropOnPropery(draggingProp.propData, compProp, index);
                      } else if (draggingProp.source === Source.COMPONENT) {
                        onDropOnPropery(cmsProp, draggingProp.propData, index);
                      }
                    }
                  : undefined
              }
            >
              <div
                class={`${
                  cmsProp ? "hover:mr-2 transition-all duration-75" : ""
                } flex-1 grid justify-end -mr-2 pr-px`}
              >
                {!!cmsProp && (
                  <Property
                    propData={cmsProp}
                    source={Source.CMS}
                    draggable={true}
                    onDragStart={(event) =>
                      onPropertyDragStart(event, cmsProp, Source.CMS)
                    }
                    onClick={() => onPropertyClick(cmsProp, Source.CMS)}
                  />
                )}
              </div>

              {!!cmsProp && !!compProp && (
                <div class="flex-0">
                  <UnlinkProperties
                    onClick={() => onUnlinkClick(cmsProp, compProp)}
                  />
                </div>
              )}

              <div
                class={`${
                  compProp ? "hover:ml-2 transition-all duration-75" : ""
                } flex-1 -ml-2`}
              >
                {!!compProp && (
                  <Property
                    propData={compProp}
                    source={Source.COMPONENT}
                    draggable={true}
                    onDragStart={(event) =>
                      onPropertyDragStart(event, compProp, Source.COMPONENT)
                    }
                    onClick={() => onPropertyClick(compProp, Source.COMPONENT)}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
