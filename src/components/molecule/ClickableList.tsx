import { FunctionComponent } from "preact";

interface IClickableList {
  listCollection: object[];
  mappedKey: string;
  mappedSubKey?: string;
  onItemClick?: (name: string) => void;
}

export const ClickableList: FunctionComponent<IClickableList> = ({
  listCollection,
  mappedKey,
  mappedSubKey,
  onItemClick,
}) => (
  <ul>
    {listCollection.map((item) => {
      const mappedItemKey = item[mappedKey];
      return (
        <li
          key={mappedItemKey}
          class="cursor-pointer"
          onClick={() => onItemClick(mappedItemKey)}
        >
          {mappedItemKey}
          <div class="text-xs">{item[mappedSubKey]}</div>
        </li>
      );
    })}
  </ul>
);
