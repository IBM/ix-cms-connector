import { FunctionComponent, JSX } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import toJsonSchema from "to-json-schema";
import { Input } from "../atoms/Input";
import { Error } from "../atoms/Error";
import { Button, ButtonType } from "../atoms/Button";
import { RadioButton } from "../atoms/RadioButton";
import { FileSelect } from "../molecules/FileSelect";
import { Dropdown, DropdownOption } from "../atoms/Dropdown";
import {
  getComponentFromJson,
  getComponentsFromJson,
  fetchData,
  type JSONSchema,
} from "../../utils";

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

  const [component, setComponent] = useState<DropdownOption>();

  const cmsOptions = [
    { label: CMSProvider.STORYBLOK, value: CMSProvider.STORYBLOK },
    { label: CMSProvider.MAGNOLIA, value: CMSProvider.MAGNOLIA },
    { label: CMSProvider.CONTENTFUL, value: CMSProvider.CONTENTFUL },
  ];

  const components = useMemo(() => {
    return json
      ? getComponentsFromJson(cmsProvider.value as CMSProvider, json)
      : undefined;
  }, [json, cmsProvider]);

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setJson(json);
      } catch (e) {
        setCmsError(true);
        setParsingCmsSchema(false);
      }
    };

    reader.readAsText(file);
  };

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

  const onChangeCMS = (cmsProvider: DropdownOption) => {
    setCmsProvider(cmsProvider);
    setComponent(undefined);
    setCmsSchema(undefined);
    setCmsError(false);
  };

  const getCmsSchemaFromUrl = useCallback(
    async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);
      const { cmsEndpoint } = Object.fromEntries(formData.entries());

      try {
        const json = await fetchData(cmsEndpoint as string);
        setJson(json);
      } catch (e) {
        setCmsError(true);
      }
    },
    []
  );

  const onRemoveFile = useCallback((): void => {
    setJson(undefined);
    setComponent(undefined);
    setCmsSchema(undefined);
    setCmsError(false);
  }, []);

  const schemaComponent: Record<SchemaProvider, JSX.Element> = {
    api: (
      <form
        aria-label="API endpoint cms"
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
    <div aria-label="CmsSchemaForm">
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
      <div class="my-6 ">
        {schemaComponent[schemaProvider]}
        {cmsError && (
          <Error>
            <p class="mb-0">Unable to process the file provided.</p>
          </Error>
        )}
      </div>
      {json && (
        <div class="z-20 relative">
          <Dropdown
            options={cmsOptions}
            label="CMS"
            handleOptionSelect={onChangeCMS}
            selected={cmsProvider}
            placeholder="Select"
          />
        </div>
      )}
      {components?.length > 0 && (
        <div class="z-10 relative mt-2">
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
      {!cmsError && cmsSchema && (
        <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
          {JSON.stringify(cmsSchema, undefined, 2)}
        </div>
      )}
    </div>
  );
};
