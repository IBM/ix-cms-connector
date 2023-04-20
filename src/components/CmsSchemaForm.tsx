import { useCallback, useState } from "preact/hooks";
import { getSchema } from "../../generate-schema";
import { Input } from "./atom/input";
import { Error } from "./Error";
import { CmsSchema } from "../utils/funcs";
import { AxiosError } from "axios";
import { Button, ButtonType } from "./atom/button";

export const CmsSchemaForm = () => {
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
      setCmsSchema((await getSchema(cmsEndpoint)) as CmsSchema);
      setParsingCmsSchema(false);
      setCmsError(false);
    } catch (err) {
      setCmsError(err);
      setParsingCmsSchema(false);
    }
  }, []);

  return (
    <>
      <form onSubmit={handleGetCmsSchema}>
        <Input
          label="Your CMS api endpoint"
          name="cmsEndpoint"
          placeholder="cms-endpoint:3000/my-component"
        />
        <Button
          text="Get CMS schema"
          type="submit"
          style={ButtonType.PRIMARY}
        />
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
