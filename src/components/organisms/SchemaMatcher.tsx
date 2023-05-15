import { FunctionComponent } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";
import { Documentation } from "react-docgen";
import { PropertyProps, Source } from "../atoms/Property";
import {
  JSONSchema,
  MappableProp,
  MappedProps,
  getCmsMappableFields,
  getComponentMappableProps,
} from "../../utils";
import { Button } from "../atoms/Button";
import { ButtonType } from "../atoms/Button";
import {
  stagedPropsReducer,
  StagedProp,
  StagedPropsActionTypes,
} from "../../reducers/stagedPropsReducer";
import { PropertyList } from "../molecules/PropertyList";
import { SchemaMatcherStage } from "../molecules/SchemaMatcherStage";

const isStaged = (
  prop: MappableProp,
  stagedProps: StagedProp[],
  source: Source
) => {
  return stagedProps.some(
    (stagedRow) => stagedRow[source === Source.CMS ? 0 : 1]?.name === prop.name
  );
};

const byName = (propA: MappableProp, propB: MappableProp) =>
  propA.name < propB.name ? -1 : 1;

type SchemaMatcherProps = {
  cmsSchema: JSONSchema;
  componentDoc: Documentation;
  onGenerate: (mappedProps: MappedProps) => void;
};

export const SchemaMatcher: FunctionComponent<SchemaMatcherProps> = ({
  cmsSchema,
  componentDoc,
  onGenerate,
}) => {
  const [cmsProps, setCmsProps] = useState<MappableProp[]>(() =>
    getCmsMappableFields(cmsSchema)
  );
  const [compProps, setCompProps] = useState<MappableProp[]>(() =>
    getComponentMappableProps(componentDoc)
  );
  const [stagedProps, dispatch] = useReducer(stagedPropsReducer, []);
  const [draggingProp, setDraggingProp] = useState<PropertyProps>(null);

  useEffect(() => {
    const updatedCmsProps = getCmsMappableFields(cmsSchema);
    const updatedCompProps = getComponentMappableProps(componentDoc);
    setCmsProps(updatedCmsProps);
    setCompProps(updatedCompProps);
    dispatch({
      type: StagedPropsActionTypes.AUTO_MAP_PROPS,
      cmsProps: updatedCmsProps,
      compProps: updatedCompProps,
    });
  }, [cmsSchema, componentDoc]);

  const handleOnGenerate = () => {
    // only pass staged props that are mapped
    onGenerate(
      stagedProps.filter(([cmsProp, compProp]) => !!cmsProp && !!compProp)
    );
  };

  const handleDragStart = (
    event: DragEvent,
    propData: MappableProp,
    source: Source
  ) => {
    event.dataTransfer.effectAllowed = "linkMove";
    setDraggingProp({ propData, source });
  };

  const mapPropsOnStage = (
    cmsProp: MappableProp,
    compProp: MappableProp,
    index = 0
  ) => {
    dispatch({
      type: StagedPropsActionTypes.ADD_PROPS,
      cmsProp,
      compProp,
      index,
    });
    setDraggingProp(null);
  };

  const addPropToStage = (prop: MappableProp, source: Source) => {
    let cmsProp: MappableProp = null;
    let compProp: MappableProp = null;
    if (source === Source.CMS) {
      cmsProp = prop;
    } else {
      compProp = prop;
    }
    dispatch({
      type: StagedPropsActionTypes.ADD_PROPS,
      cmsProp,
      compProp,
      index: 0,
    });
    if (draggingProp) {
      setDraggingProp(null);
    }
  };

  const removePropFromStage = (prop: MappableProp, source: Source) => {
    let cmsProp: MappableProp = null;
    let compProp: MappableProp = null;
    if (source === Source.CMS) {
      cmsProp = prop;
    } else {
      compProp = prop;
    }
    dispatch({ type: StagedPropsActionTypes.REMOVE_PROPS, cmsProp, compProp });
    if (draggingProp) {
      setDraggingProp(null);
    }
  };

  const unlinkPropsOnStage = (
    cmsProp: MappableProp,
    compProp: MappableProp
  ) => {
    dispatch({ type: StagedPropsActionTypes.REMOVE_PROPS, cmsProp, compProp });
  };

  return (
    <div
      onDrop={() =>
        removePropFromStage(draggingProp.propData, draggingProp.source)
      }
    >
      <div class="grid grid-cols-2">
        <PropertyList
          list={cmsProps
            .filter((cmsProp) => !isStaged(cmsProp, stagedProps, Source.CMS))
            .sort(byName)}
          source={Source.CMS}
          draggingProp={draggingProp}
          onPropertyDragStart={handleDragStart}
          onDropOnProperty={mapPropsOnStage}
          onPropertyClick={addPropToStage}
        />

        <PropertyList
          list={compProps
            .filter(
              (cmsProp) => !isStaged(cmsProp, stagedProps, Source.COMPONENT)
            )
            .sort(byName)}
          source={Source.COMPONENT}
          draggingProp={draggingProp}
          onPropertyDragStart={handleDragStart}
          onDropOnProperty={mapPropsOnStage}
          onPropertyClick={addPropToStage}
        />
      </div>

      <SchemaMatcherStage
        stagedProps={stagedProps}
        draggingProp={draggingProp}
        onDropOnStage={addPropToStage}
        onDropOnPropery={mapPropsOnStage}
        onPropertyDragStart={handleDragStart}
        onPropertyClick={removePropFromStage}
        onUnlinkClick={unlinkPropsOnStage}
      />

      <Button
        text="Generate adapter"
        style={ButtonType.PRIMARY}
        onClick={handleOnGenerate}
      />
    </div>
  );
};
