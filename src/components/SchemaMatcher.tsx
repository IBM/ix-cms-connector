import { FunctionComponent } from "preact";
import { MappableProp } from "../utils/types";
import { useMemo, useReducer, useRef } from "preact/hooks";

interface IClickableList {
  listCollection: object[];
  mappedKey: string;
  onItemClick?: (name: string) => void;
  disabledMappedKeys?: string[];
}

const ClickableList: FunctionComponent<IClickableList> = ({
  listCollection,
  mappedKey,
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
  cmsSchema: MappableProp[];
  componentProps: MappableProp[];
}

export const SchemaMatcher: FunctionComponent<ISchemaForm> = ({
  cmsSchema = [],
  componentProps = [],
}) => {
  const [mappedFields, dispatch] = useReducer(mappedFieldsReducer, []);
  const schemaFieldToMap = useRef();
  const onSchemaFieldClick = (name) => {
    schemaFieldToMap.current = name;
  };
  const onComponentPropClick = (name) => {
    dispatch({
      type: "ADD_MAPPED_FIELDS",
      payload: [schemaFieldToMap.current, name],
    });
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
        {!!cmsSchema.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Schema Fields</h4>
            <ClickableList
              disabledMappedKeys={mappedSchemaFields}
              listCollection={cmsSchema}
              mappedKey="name"
              onItemClick={onSchemaFieldClick}
            ></ClickableList>
          </div>
        )}
        {!!componentProps.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Component Props</h4>
            <ClickableList
              disabledMappedKeys={mappedComponentProps}
              listCollection={componentProps}
              mappedKey="name"
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
