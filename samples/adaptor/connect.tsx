import { ComponentType } from "preact";

// generated from the mapped CMS fields
interface SampleComponentMappedCMSFields {
  headline: string;
  hyphenatedHeadline: boolean;
  imageLink: {
    title: string;
    filename: string;
  };
}

// generated from the mapped component props
interface SampleComponentMappedProps {
  label: string;
  isActive: boolean;
  link: {
    url: string;
    title: string;
  };
}

export function connectSampleComponentToCMS(
  cmsData: SampleComponentMappedCMSFields
) {
  return function enhance<P extends SampleComponentMappedProps>(
    Component: ComponentType<P>
  ) {
    // restProps actullay includes also all the mapped props,
    // but they are optional now
    return function ConnectedComponent(
      restProps: Omit<P, keyof SampleComponentMappedProps> &
        Partial<SampleComponentMappedProps>
    ) {
      const mappedProps: SampleComponentMappedProps = {
        label: cmsData.headline,
        isActive: cmsData.hyphenatedHeadline,
        link: {
          url: cmsData.imageLink.filename,
          title: cmsData.imageLink.title,
        },
      };

      const allProps = {
        ...mappedProps,
        ...restProps,
      } as P;

      return <Component {...allProps} />;
    };
  };
}
