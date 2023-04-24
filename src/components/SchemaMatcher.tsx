import { FunctionComponent } from "preact";
import { useMemo, useRef, useState } from "preact/hooks";
import { Documentation } from "react-docgen";
import {
  CmsSchema,
  MappableProp,
  MappedFields,
  getCmsMappableFields,
  getComponentMappableProps,
} from "../utils";
import { useCallback } from "react";
import { ClickableList } from "./molecule/ClickableList";
import { Button, ButtonType } from "./atom/button";

type IMappedFields = [string, string][];

interface ISchemaMatcher {
  cmsSchema: CmsSchema;
  componentDoc: Documentation;
  onGenerate?: (mappedFields: MappedFields) => void;
}

export const SchemaMatcher: FunctionComponent<ISchemaMatcher> = ({
  cmsSchema,
  componentDoc,
  onGenerate,
}) => {
  const [mappedFields, setMappedFields] = useState<IMappedFields>([]);
  const cmsFieldToMap = useRef<string | null>(null);
  const componentPropToMap = useRef<string | null>(null);

  // convert cms and component schemas to common type
  const cmsMappableFields: MappableProp[] = useMemo(
    () => getCmsMappableFields(cmsSchema),
    [cmsSchema]
  );
  const componentMappableProps: MappableProp[] = useMemo(
    () => getComponentMappableProps(componentDoc),
    [componentDoc]
  );

  const onCmsSchemaFieldClick = useCallback((name: string) => {
    if (componentPropToMap.current) {
      setMappedFields((prevState) => [
        ...prevState,
        [name, componentPropToMap.current],
      ]);
      componentPropToMap.current = null;
    } else {
      cmsFieldToMap.current = name;
    }
  }, []);

  const onComponentPropClick = useCallback((name: string) => {
    if (cmsFieldToMap.current) {
      setMappedFields((prevState) => [
        ...prevState,
        [cmsFieldToMap.current, name],
      ]);
      cmsFieldToMap.current = null;
    } else {
      componentPropToMap.current = name;
    }
  }, []);

  const onMappedLinkClick = useCallback(([cmsField, componentProp]) => {
    setMappedFields((prevState) => {
      const indexToRemove = prevState.findIndex(
        (mappedFields) =>
          mappedFields[0] === cmsField && mappedFields[1] === componentProp
      );
      return [
        ...prevState.slice(0, indexToRemove),
        ...prevState.slice(indexToRemove + 1),
      ];
    });
  }, []);

  // callback to get the mappedfields with mappable props
  const getMappedFields: () => [MappableProp, MappableProp][] = useCallback(
    () =>
      mappedFields.map(([cmsField, componentProp]) => [
        cmsMappableFields.find(({ name }) => name === cmsField),
        componentMappableProps.find(({ name }) => name === componentProp),
      ]),
    [mappedFields]
  );

  // get unmapped fields to be rendered as clickable lists
  const unmappedCmsSchemaFields: MappableProp[] = useMemo(
    () =>
      cmsMappableFields.filter(
        (field) => !mappedFields.flat().includes(field.name)
      ),
    [cmsMappableFields, mappedFields]
  );
  const unmappedComponentProps: MappableProp[] = useMemo(
    () =>
      componentMappableProps.filter(
        (field) => !mappedFields.flat().includes(field.name)
      ),
    [componentMappableProps, mappedFields]
  );

  return (
    <>
      <div class="grid grid-cols-2 gap-4 mb-4">
        {!!cmsMappableFields.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Schema Fields</h4>
            <ClickableList
              listCollection={unmappedCmsSchemaFields}
              mappedKey="name"
              mappedSubKey="type"
              onItemClick={onCmsSchemaFieldClick}
            ></ClickableList>
          </div>
        )}
        {!!componentMappableProps.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Component Props</h4>
            <ClickableList
              listCollection={unmappedComponentProps}
              mappedKey="name"
              mappedSubKey="type"
              onItemClick={onComponentPropClick}
            ></ClickableList>
          </div>
        )}
      </div>
      {!!mappedFields.length && (
        <div>
          <h4 class="mb-4 font-semibold text-sm">Mapped Props</h4>
          <ul>
            {mappedFields.map(([schemaField, componentProp]) => (
              <li>
                {schemaField}
                <span
                  class="cursor-pointer"
                  onClick={() =>
                    onMappedLinkClick([schemaField, componentProp])
                  }
                >
                  -
                </span>
                {componentProp}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button
        text="Generate Adapter"
        style={ButtonType.PRIMARY}
        onClick={() => {
          onGenerate(getMappedFields());
        }}
      />
    </>
  );
};
