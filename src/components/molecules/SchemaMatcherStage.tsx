import { FunctionComponent } from "preact";
import { StagedProp } from "../../reducers/stagedPropsReducer";
import { Property, PropertyProps } from "../atoms/Property";
import { MappableProp, PropSource } from "../../utils";
import { UnlinkProperties } from "../atoms/UnlinkProperties";
import { canMapProps } from "../../utils/funcs/getPropsConverter";

type SchemaMatcherStageProps = {
  stagedProps: StagedProp[];
  draggingProp: PropertyProps | null;
  onDropOnStage: (propData: MappableProp, source: PropSource) => void;
  onDropOnPropery: (
    cmsProp: MappableProp,
    compProp: MappableProp,
    index: number
  ) => void;
  onPropertyDragStart: (
    event: DragEvent,
    propData: MappableProp,
    source: PropSource
  ) => void;
  onPropertyClick: (propData: MappableProp, source: PropSource) => void;
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
      class="py-8 my-8 border border-dashed border-ui-03 relative"
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
          if (draggingProp?.source === PropSource.CMS) {
            isMappable =
              !!compProp && canMapProps(draggingProp.propData, compProp);
          } else if (draggingProp?.source === PropSource.COMPONENT) {
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
                      if (draggingProp.source === PropSource.CMS) {
                        onDropOnPropery(draggingProp.propData, compProp, index);
                      } else if (draggingProp.source === PropSource.COMPONENT) {
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
                    source={PropSource.CMS}
                    draggable={true}
                    onDragStart={(event) =>
                      onPropertyDragStart(event, cmsProp, PropSource.CMS)
                    }
                    onClick={() => onPropertyClick(cmsProp, PropSource.CMS)}
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
                    source={PropSource.COMPONENT}
                    draggable={true}
                    onDragStart={(event) =>
                      onPropertyDragStart(event, compProp, PropSource.COMPONENT)
                    }
                    onClick={() =>
                      onPropertyClick(compProp, PropSource.COMPONENT)
                    }
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
