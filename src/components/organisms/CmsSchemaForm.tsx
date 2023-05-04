import { FunctionComponent, JSX } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import toJsonSchema from "to-json-schema";
import { Input } from "../atom/Input";
import { Error } from "../atom/Error";
import { Button, ButtonType } from "../atom/Button";
import { RadioButton } from "../atom/RadioButton";
import { FileSelect } from "../molecule/FileSelect";
import { Dropdown, DropdownOption } from "../atom/Dropdown";
import { getJSONSchema, type JSONSchema } from "../../utils";

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
  const [cmsError, setCmsError] = useState<boolean>(false);
  const [parsingCmsSchema, setParsingCmsSchema] = useState(false);
  const [schemaProvider, setSchemaProvider] = useState<SchemaProvider>("api");
  const [file, setFile] = useState<File>();
  const [cmsProvider, setCmsProvider] = useState<DropdownOption>();

  const cmsOptions = [
    { label: CMSProvider.STORYBLOK, value: CMSProvider.STORYBLOK },
    { label: CMSProvider.MAGNOLIA, value: CMSProvider.MAGNOLIA },
    { label: CMSProvider.CONTENTFUL, value: CMSProvider.STORYBLOK },
  ];

  useEffect(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        setParsingCmsSchema(true);

        const json = JSON.parse(e.target?.result as string);

        const cmsSchema = toJsonSchema(json);

        setCmsSchema(cmsSchema);
        setParsingCmsSchema(false);
        setCmsError(false);

        onGenerate(cmsSchema);
      } catch (e) {
        setCmsError(true);
        setParsingCmsSchema(false);
      }
    };

    reader.readAsText(file);
  }, [file]);

  useEffect(() => {
    if (cmsSchema) {
      switch (cmsProvider.value) {
        case CMSProvider.STORYBLOK:
          break;

        default:
          break;
      }
    }
  }, [cmsProvider, cmsSchema]);

  const getCmsSchemaFromUrl = useCallback(
    async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);
      const { cmsEndpoint } = Object.fromEntries(formData.entries());

      try {
        setParsingCmsSchema(true);

        const cmsSchema = await getJSONSchema(cmsEndpoint as string);

        setCmsSchema(cmsSchema);
        setParsingCmsSchema(false);
        setCmsError(false);

        onGenerate(cmsSchema);
      } catch (e) {
        setCmsError(true);
        setParsingCmsSchema(false);
      }
    },
    []
  );

  const onRemoveFile = useCallback((): void => {
    setFile(null);
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
    json: <FileSelect onSelect={setFile} onRemoveFile={onRemoveFile} />,
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
      <Dropdown
        options={cmsOptions}
        label="CMS"
        handleOptionSelect={setCmsProvider}
        selected={cmsProvider}
      />
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
