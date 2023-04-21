import { FunctionComponent } from "preact";
import { useMemo, useReducer, useRef } from "preact/hooks";
import { Documentation } from "react-docgen";
import {
  CmsSchema,
  getCmsMappableFields,
  getComponentMappableProps,
} from "../utils";

interface IClickableList {
  listCollection: object[];
  mappedKey: string;
  mappedSubKey?: string;
  onItemClick?: (name: string) => void;
  disabledMappedKeys?: string[];
}

const ClickableList: FunctionComponent<IClickableList> = ({
  listCollection,
  mappedKey,
  mappedSubKey,
  onItemClick,
  disabledMappedKeys,
}) => (
  <ul>
    {listCollection.map((item) => {
      const mappedItemKey = item[mappedKey];
      return (
        <li
          key={mappedItemKey}
          class={`${
            disabledMappedKeys.includes(mappedItemKey)
              ? "pointer-events-none opacity-60"
              : "cursor-pointer"
          }`}
          onClick={() => onItemClick(mappedItemKey)}
        >
          {mappedItemKey}
          <div class="text-xs">{item[mappedSubKey]}</div>
        </li>
      );
    })}
  </ul>
);

type IMappedFields = [string, string][];

interface IMappedFieldsAction {
  type: string;
  payload?: [string, string];
}

const mappedFieldsReducer = (
  state: IMappedFields,
  action: IMappedFieldsAction
) => {
  switch (action.type) {
    case "ADD_MAPPED_FIELDS":
      return [...state, action.payload];
    default:
      return state;
  }
};

interface ISchemaForm {
  cmsSchema: CmsSchema;
  componentDoc: Documentation;
}

export const SchemaMatcher: FunctionComponent<ISchemaForm> = ({
  cmsSchema,
  componentDoc,
}) => {
  const cmsMappableFields = useMemo(
    () => getCmsMappableFields(cmsSchema),
    [cmsSchema]
  );
  const componentMappableProps = useMemo(
    () => getComponentMappableProps(componentDoc),
    [componentDoc]
  );

  const [mappedFields, dispatch] = useReducer(mappedFieldsReducer, []);
  const schemaFieldToMap = useRef(null);
  const componentPropToMap = useRef(null);

  const onSchemaFieldClick = (name) => {
    if( componentPropToMap.current ) {
      dispatch({
        type: "ADD_MAPPED_FIELDS",
        payload: [name, componentPropToMap.current],
      });
    } else { 
      schemaFieldToMap.current = name;
    }
  };
  const onComponentPropClick = (name) => {
    if( schemaFieldToMap.current ) {
      dispatch({
        type: "ADD_MAPPED_FIELDS",
        payload: [schemaFieldToMap.current, name],
      });
      schemaFieldToMap.current = null;
    } else {
      componentPropToMap.current = name;
    }
  };

  const mappedSchemaFields = useMemo(
    () => mappedFields.map(([schemaField, componentProp]) => schemaField),
    [mappedFields]
  );
  const mappedComponentProps = useMemo(
    () => mappedFields.map(([schemaField, componentProp]) => componentProp),
    [mappedFields]
  );

  return (
    <>
      <div class="grid grid-cols-2 gap-4 mb-4">
        {!!cmsMappableFields.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Schema Fields</h4>
            <ClickableList
              disabledMappedKeys={mappedSchemaFields}
              listCollection={cmsMappableFields}
              mappedKey="name"
              mappedSubKey="type"
              onItemClick={onSchemaFieldClick}
            ></ClickableList>
          </div>
        )}
        {!!componentMappableProps.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Component Props</h4>
            <ClickableList
              disabledMappedKeys={mappedComponentProps}
              listCollection={componentMappableProps}
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
              <li>{`${schemaField}-${componentProp}`}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
