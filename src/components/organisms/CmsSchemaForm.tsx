import { FunctionComponent, JSX } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import toJsonSchema from "to-json-schema";
import { Input } from "../atom/Input";
import { Error } from "../atom/Error";
import { Button, ButtonType } from "../atom/Button";
import { RadioButton } from "../atom/RadioButton";
import { FileSelect } from "../molecule/FileSelect";
import { Dropdown, DropdownOption } from "../atom/Dropdown";
import { getComponentFromJson, getComponentsFromJson, getJSON, type JSONSchema } from "../../utils";

interface CmsSchemaFormProps {
  onGenerate: (cmsSchema: JSONSchema) => void;
}

type SchemaProvider = "api" | "json";

export enum CMSProvider {
  STORYBLOK = "Storyblok",
  CONTENTFUL = "Contentful (not yet implemented)",
  MAGNOLIA = "Magnolia (not yet implemented)",
}

export const CmsSchemaForm: FunctionComponent<CmsSchemaFormProps> = ({
  onGenerate,
}) => {
  const [cmsSchema, setCmsSchema] = useState<JSONSchema>();
  const [json, setJson] = useState<JSON>();

  const [cmsError, setCmsError] = useState<boolean>(false);
  const [parsingCmsSchema, setParsingCmsSchema] = useState(false);

  const [schemaProvider, setSchemaProvider] = useState<SchemaProvider>("api");
  const [cmsProvider, setCmsProvider] = useState<DropdownOption>({
    label: CMSProvider.STORYBLOK,
    value: CMSProvider.STORYBLOK,
  });
  
  const [components, setComponents] = useState<any[]>();
  const [component, setComponent] = useState<DropdownOption>();

  const cmsOptions = [
    { label: CMSProvider.STORYBLOK, value: CMSProvider.STORYBLOK },
    { label: CMSProvider.MAGNOLIA, value: CMSProvider.MAGNOLIA },
    { label: CMSProvider.CONTENTFUL, value: CMSProvider.CONTENTFUL },
  ];

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        const components = getComponentsFromJson(
          cmsProvider.value as CMSProvider,
          json
        );

        setComponents(components);
        setJson(json);
      } catch (e) {
        setCmsError(true);
        setParsingCmsSchema(false);
      }
    };

    reader.readAsText(file);
  }

  useEffect(() => {
    if (!json) {
      return;
    }

    const newComponents = getComponentsFromJson(
      cmsProvider.value as CMSProvider,
      json
    );

    setComponents(newComponents);
  }, [cmsProvider]);

  useEffect(() => {
    if (!json || !component) {
      return;
    }

    const filteredComponent = getComponentFromJson(
      cmsProvider.value as CMSProvider,
      json,
      component.value
    );

    if (filteredComponent) {
      try {
        setParsingCmsSchema(true);

        const cmsSchema = toJsonSchema(filteredComponent);
        setCmsSchema(cmsSchema);
        setParsingCmsSchema(false);
        setCmsError(false);

        onGenerate(cmsSchema);
      } catch (e) {
        setCmsError(true);
        setParsingCmsSchema(false);
      }
    }
  }, [component]);

  const getCmsSchemaFromUrl = useCallback(
    async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);
      const { cmsEndpoint } = Object.fromEntries(formData.entries());

      try {
        const json = await getJSON(cmsEndpoint as string);
        const components = getComponentsFromJson(cmsProvider.value as CMSProvider, json);

        setJson(json);
        setComponents(components);
      } catch (e) {
        setCmsError(true);
      }
    },
    []
  );

  const onRemoveFile = useCallback((): void => {
    setJson(null);
    setComponents(null);
    setComponent(null);
    setCmsSchema(null);
  }, []);

  const schemaComponent: Record<SchemaProvider, JSX.Element> = {
    api: (
      <form
        onSubmit={getCmsSchemaFromUrl}
        class="flex flex-row max-h-12 items-center"
      >
        <Input
          name="cmsEndpoint"
          placeholder="cms-endpoint:3000/my-component"
        />
        <Button
          text="Get CMS schema"
          type="submit"
          style={ButtonType.PRIMARY}
        />
      </form>
    ),
    json: <FileSelect onSelect={readFile} onRemoveFile={onRemoveFile} />,
  };

  return (
    <>
      <div class="flex flex-col">
        <RadioButton
          label="API endpoint"
          name="cms"
          value={"api"}
          checked={schemaProvider === "api"}
          onClick={() => setSchemaProvider("api")}
        />
        <RadioButton
          label="JSON File upload"
          name="cms"
          value={"json"}
          checked={schemaProvider === "json"}
          onClick={() => setSchemaProvider("json")}
        />
      </div>
      <div class="my-6 ">{schemaComponent[schemaProvider]}</div>
      <div class="z-40 relative">
        <Dropdown
          options={cmsOptions}
          label="CMS"
          handleOptionSelect={setCmsProvider}
          selected={cmsProvider}
          placeholder="Select"
        />
      </div>
      {components?.length > 0 && (
        <div class="z-10 relative">
          <Dropdown
            label="Component"
            options={components}
            handleOptionSelect={setComponent}
            selected={component}
            placeholder="Select"
          ></Dropdown>
        </div>
      )}
      {parsingCmsSchema && <span>Parsing...</span>}
      {cmsError && <Error error="Unable to process this action!" />}
      {!cmsError && cmsSchema && (
        <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
          {JSON.stringify(cmsSchema, undefined, 2)}
        </div>
      )}
    </>
  );
};
