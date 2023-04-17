import { useCallback, useState } from "preact/hooks";
import { getSchema } from "../../generate-schema";
import { Button } from "./Button";
import { Input } from "./Input";
import { Error } from "./Error";
import { CmsSchema } from "../utils/types";
import { AxiosError } from "axios";
import { FunctionComponent } from "preact";

interface CmsSchemaFormProps {
  onParsed?: (cmsSchema?: CmsSchema, error?: unknown) => void;
}

export const CmsSchemaForm: FunctionComponent<CmsSchemaFormProps> = ({
  onParsed,
}) => {
  const [cmsSchema, setCmsSchema] = useState<CmsSchema>();
  const [cmsError, setCmsError] = useState<AxiosError | false>(false);
  const [parsingCmsSchema, setParsingCmsSchema] = useState(false);

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

      if (onParsed) {
        onParsed(cmsSchema);
      }
    } catch (err) {
      setCmsError(err);
      setParsingCmsSchema(false);

      if (onParsed) {
        onParsed(undefined, err);
      }
    }
  }, []);

  return (
    <>
      <form onSubmit={handleGetCmsSchema}>
        <Input label="Your CMS api endpoint" name="cmsEndpoint" />
        <Button text="Get CMS schema" type="submit" />
      </form>
      {parsingCmsSchema && <span>Parsing...</span>}
      {cmsError && <Error error={JSON.stringify(cmsError, undefined, 2)} />}
      {!cmsError && cmsSchema && (
        <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
          {JSON.stringify(cmsSchema, undefined, 2)}
        </div>
      )}
    </>
  );
};
