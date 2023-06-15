/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionComponent } from "preact";
import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
import { Documentation } from "react-docgen";
import { PropertyProps } from "../atoms/Property";
import {
  JSONSchema,
  MappableProp,
  MappedProps,
  PropSource,
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
import { PropertyFilters } from "../molecules/PropertyFilters";

const isStaged = (
  prop: MappableProp,
  stagedProps: StagedProp[],
  source: PropSource
) => {
  return stagedProps.some(
    (stagedRow) =>
      stagedRow[source === PropSource.CMS ? 0 : 1]?.name === prop.name
  );
};

const byName = (propA: MappableProp, propB: MappableProp) =>
  propA.name < propB.name ? -1 : 1;

type SchemaMatcherProps = {
  cms: string;
  cmsSchema: JSONSchema;
  componentDoc: Documentation;
  onGenerate: (mappedProps: MappedProps) => void;
};

export const SchemaMatcher: FunctionComponent<SchemaMatcherProps> = ({
  cms,
  cmsSchema,
  componentDoc,
  onGenerate,
}) => {
  const [filteredCmsProps, setFilteredCmsProps] = useState<
    MappableProp[] | null
  >(null);

  const [filteredCompProps, setFilteredCompProps] = useState<
    MappableProp[] | null
  >(null);

  const [cmsProps, setCmsProps] = useState<MappableProp[]>(() =>
    getCmsMappableFields(cmsSchema, cms)
  );

  const [compProps, setCompProps] = useState<MappableProp[]>(() =>
    getComponentMappableProps(componentDoc)
  );

  const [stagedProps, dispatch] = useReducer(stagedPropsReducer, []);

  const [draggingProp, setDraggingProp] = useState<PropertyProps>(null);

  const unstagedCmsProps = useMemo(
    () =>
      cmsProps
        .filter((cmsProp) => !isStaged(cmsProp, stagedProps, PropSource.CMS))
        .sort(byName),
    [stagedProps]
  );

  const unstagedCompProps = useMemo(
    () =>
      compProps
        .filter(
          (compProp) => !isStaged(compProp, stagedProps, PropSource.COMPONENT)
        )
        .sort(byName),
    [stagedProps]
  );

  useEffect(() => {
    const updatedCmsProps = getCmsMappableFields(cmsSchema, cms);
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
    source: PropSource
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

  const addPropToStage = (prop: MappableProp, source: PropSource) => {
    let cmsProp: MappableProp = null;
    let compProp: MappableProp = null;

    if (source === PropSource.CMS) {
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

  const removePropFromStage = (prop: MappableProp, source: PropSource) => {
    let cmsProp: MappableProp = null;
    let compProp: MappableProp = null;

    if (source === PropSource.CMS) {
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
      class="p-4"
      onDrop={() =>
        removePropFromStage(draggingProp.propData, draggingProp.source)
      }
    >
      <div class="grid grid-cols-2 gap-8">
        <div class="flex flex-col">
          <PropertyFilters
            list={unstagedCmsProps}
            onPropertiesFiltered={(filteredProps) =>
              setFilteredCmsProps(filteredProps)
            }
          />
          <PropertyList
            list={filteredCmsProps || unstagedCmsProps}
            source={PropSource.CMS}
            draggingProp={draggingProp}
            onPropertyDragStart={handleDragStart}
            onDropOnProperty={mapPropsOnStage}
            onPropertyClick={addPropToStage}
          />
        </div>

        <div class="flex flex-col">
          <PropertyFilters
            list={unstagedCompProps}
            alignRight
            onPropertiesFiltered={(filteredProps) =>
              setFilteredCompProps(filteredProps)
            }
          />
          <PropertyList
            list={filteredCompProps || unstagedCompProps}
            source={PropSource.COMPONENT}
            draggingProp={draggingProp}
            onPropertyDragStart={handleDragStart}
            onDropOnProperty={mapPropsOnStage}
            onPropertyClick={addPropToStage}
          />
        </div>
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
