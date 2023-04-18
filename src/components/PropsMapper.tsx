import { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import { Documentation } from "react-docgen";
import {
  CmsSchema,
  getCmsMappableFields,
  getComponentMappableProps,
} from "../utils";

interface PropsMapperProps {
  cmsSchema: CmsSchema;
  componentDoc: Documentation;
}

// todo: rename the component if necessary
export const PropsMapper: FunctionComponent<PropsMapperProps> = ({
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

  // todo: dummy render, just to show the fields
  return (
    <div class="grid grid-cols-2">
      <div class="p-4">
        <ul>
          {cmsMappableFields.map((f) => (
            <li>{f.name}</li>
          ))}
        </ul>
      </div>

      <div class="p-4">
        <ul>
          {componentMappableProps.map((p) => (
            <li>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
