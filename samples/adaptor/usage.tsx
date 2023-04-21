import { connectSampleComponentToCMS } from "./connect";
import { SampleComponent } from "./SampleComponent";

const cmsData = { headline: "Description", hyphenatedHeadline: true };

function ExampleApp() {
  const CMSComponent = connectSampleComponentToCMS(cmsData)(SampleComponent);

  return (
    <>
      <CMSComponent dateCreated={new Date()} />
    </>
  );
}
