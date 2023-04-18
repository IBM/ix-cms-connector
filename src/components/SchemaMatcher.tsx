import { FunctionComponent } from "preact";
import { MappableProp } from "../utils/types";

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
  cmsSchema: MappableProp[];
  componentProps: MappableProp[];
}

export const SchemaMatcher: FunctionComponent<ISchemaForm> = ({
  cmsSchema = [],
  componentProps = [],
}) => {
  return (
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h4 class="mb-4 font-semibold text-sm">Schema Fields</h4>
        <ClickableList
          listCollection={cmsSchema}
          mappedKey="name"
        ></ClickableList>
      </div>
      <div>
        <h4 class="mb-4 font-semibold text-sm">Component Props</h4>
        <ClickableList
          listCollection={componentProps}
          mappedKey="name"
        ></ClickableList>
      </div>
    </div>
  );
};
