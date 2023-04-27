import { FunctionComponent } from "preact";
import { useMemo, useRef, useState } from "preact/hooks";
import { Documentation } from "react-docgen";
import {
  type JSONSchema,
  type MappableProp,
  type MappedProps,
  getCmsMappableFields,
  getComponentMappableProps,
} from "../../utils";
import { useCallback } from "react";
import { ClickableList } from "../molecule/ClickableList";
import { Button, ButtonType } from "../atom/Button";

type MappedFields = [string, string][];

interface SchemaMatcherProps {
  cmsSchema: JSONSchema;
  componentDoc: Documentation;
  onGenerate?: (mappedProps: MappedProps) => void;
}

export const SchemaMatcher: FunctionComponent<SchemaMatcherProps> = ({
  cmsSchema,
  componentDoc,
  onGenerate,
}) => {
  const [mappedFields, setMappedFields] = useState<MappedFields>([]);
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

  const onMappedLinkClick = useCallback((pairIndex) => {
    setMappedFields((prevState) => {
      return [
        ...prevState.slice(0, pairIndex),
        ...prevState.slice(pairIndex + 1),
      ];
    });
  }, []);

  // callback to get MappedProps from MappedFields
  const getMappedProps: () => MappedProps = useCallback(
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
            {mappedFields.map(([schemaField, componentProp], index) => (
              <li>
                {schemaField}
                <span
                  class="cursor-pointer"
                  onClick={() => onMappedLinkClick(index)}
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
          onGenerate(getMappedProps());
        }}
      />
    </>
  );
};
