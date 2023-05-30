import { connectSampleComponentToCMS } from "./connect";
import { SampleComponent } from "./SampleComponent";

// this is sample data that comes from a CMS component (a part of the CMS JSON)
const cmsData = { headline: "Description", hyphenatedHeadline: true };

function ExampleApp() {
  // here we call our HOF, pass the data as an argument, then pass our original component to the next function
  // it returns us a new component, that wraps our original component with the CMS data already passed to it
  const ConnectedComponent =
    connectSampleComponentToCMS(cmsData)(SampleComponent);

  return (
    <>
      {/* we can pass the rest of the props if necessary (eg. they are required) or even overwrite the props with the CMS data */}
      <ConnectedComponent dateCreated={new Date()} />
      <ConnectedComponent dateCreated={new Date()} label="New Label" />
    </>
  );
}
