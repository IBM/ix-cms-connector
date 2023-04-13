
import { useState } from "react";
import { getSchema } from "../../generate-schema";
import { Button } from "./Button";
import { Input } from "./Input";
import { Error } from "./Error";

export const CmsSchemaForm = () => {
    const [cmsSchema, setCmsSchema] = useState<string>('');
    const [cmsError, setCmsError] = useState<string>('');
    const [parsingCmsSchema, setParsingCmsSchema] = useState(false);

    const handleGetCmsSchema = (e) => {
        e.preventDefault();
        setParsingCmsSchema(true);
        generateCmsSchema(e);
    }

    const generateCmsSchema= async(e) => {
        const form = e.target;
        const formData = new FormData(form);
        const { cmsEndpoint } = Object.fromEntries(formData.entries());

        try {
            setCmsSchema( JSON.stringify(await getSchema(cmsEndpoint), undefined, 2) );
            setParsingCmsSchema(false);
        }
        catch(err) {
            setCmsError( JSON.stringify(err, undefined, 2) );
            setParsingCmsSchema(false);
        }
    }

    return (
        <>
            <form onSubmit={handleGetCmsSchema}>
                <Input label='Your CMS api endpoint' name='cmsEndpoint' />
                <Button text='Get CMS schema' type='submit'/>
            </form>
            { parsingCmsSchema && <span>Parsing...</span>}
            { cmsError && (
                <Error error={cmsError} />
            )}
            { !cmsError && cmsSchema && (
                <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
                {cmsSchema}
                </div>
            )}
        </>
    );

}

