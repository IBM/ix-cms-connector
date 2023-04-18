import { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import { Documentation } from "react-docgen";
import {
  CmsSchema,
  getCmsMappableFields,
  getComponentMappableProps,
} from "../utils";

interface IClickableList {
  listCollection: any[];
  mappedKey: string;
  onItemClick?: (item: any) => void;
}

const ClickableList: FunctionComponent<IClickableList> = ({
  listCollection,
  mappedKey,
  onItemClick,
}) => (
  <ul>
    {listCollection.map((item) => (
      <li onClick={(item) => onItemClick(item)}>{item[mappedKey]}</li>
    ))}
  </ul>
);

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

  return (
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h4 class="mb-4 font-semibold text-sm">Schema Fields</h4>
        <ClickableList
          listCollection={cmsMappableFields}
          mappedKey="name"
        ></ClickableList>
      </div>
      <div>
        <h4 class="mb-4 font-semibold text-sm">Component Props</h4>
        <ClickableList
          listCollection={componentMappableProps}
          mappedKey="name"
        ></ClickableList>
      </div>
    </div>
  );
};
