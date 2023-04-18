import { FunctionComponent } from "preact";
import { MappableProp } from "../utils/types";
import { useReducer, useRef } from "preact/hooks";

interface IClickableList {
  listCollection: object[];
  mappedKey: string;
  onItemClick?: (name: string) => void;
}

const ClickableList: FunctionComponent<IClickableList> = ({
  listCollection,
  mappedKey,
  onItemClick,
}) => (
  <ul>
    {listCollection.map((item) => {
      return (
        <li class="cursor-pointer" onClick={() => onItemClick(item[mappedKey])}>
          {item[mappedKey]}
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

  return (
    <>
      <div class="grid grid-cols-2 gap-4 mb-4">
        {!!cmsSchema.length && (
          <div>
            <h4 class="mb-4 font-semibold text-sm">Schema Fields</h4>
            <ClickableList
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
