import { useCallback, useEffect, useState } from "preact/hooks";
import { getSchema } from "../../generate-schema";
import { Input } from "./atom/input";
import { Error } from "./Error";
import { CmsSchema } from "../utils/types";
import { FunctionComponent } from "preact";
import { Button, ButtonType } from "./atom/button";
import { RadioButton } from "./atom/RadioButton";
import { FileSelect } from "./molecule/FileSelect";
import jsonSchemaGenerator from "json-schema-generator";

interface CmsSchemaFormProps {
  onGenerate: (cmsSchema: CmsSchema) => void;
}

type SchemaProvider = "api" | "json";

export const CmsSchemaForm: FunctionComponent<CmsSchemaFormProps> = ({
  onGenerate,
}) => {
  const [cmsSchema, setCmsSchema] = useState<CmsSchema>();
  const [cmsError, setCmsError] = useState<boolean>(false);
  const [parsingCmsSchema, setParsingCmsSchema] = useState(false);
  const [schemaProvider, setSchemaProvider] = useState<SchemaProvider>("api");
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result as string);

        /* Remove or update with the new library */
        const cmsSchema = jsonSchemaGenerator(json) as CmsSchema;

        setCmsSchema(cmsSchema);
        setParsingCmsSchema(false);
        setCmsError(false);

        setParsingCmsSchema(false);
      } catch (e) {
        setCmsError(true);
      }
    };

    reader.readAsText(file);
  }, [file]);

  const handleGetCmsSchema = (e) => {
    e.preventDefault();
    setParsingCmsSchema(true);
    generateCmsSchema(e);
  };

  const generateCmsSchema = useCallback(async (e) => {
    const form = e.target;
    const formData = new FormData(form);
    const { cmsEndpoint } = Object.fromEntries(formData.entries());

    try {
      const cmsSchema = (await getSchema(cmsEndpoint)) as CmsSchema;

      setCmsSchema(cmsSchema);
      setParsingCmsSchema(false);
      setCmsError(false);

      onGenerate(cmsSchema);
    } catch (err) {
      setCmsError(err);
      setParsingCmsSchema(false);
    }
  }, []);

  const onRemoveFile = useCallback((): void => {
    setFile(null);
    setCmsSchema(null);
  }, []);

  const schemaComponent: Record<SchemaProvider, JSX.Element> = {
    api: (
      <form
        onSubmit={handleGetCmsSchema}
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
      <div class="mt-6">{schemaComponent[schemaProvider]}</div>
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
