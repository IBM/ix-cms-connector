import { ComponentType } from "preact";

interface SampleComponentMappedCMSFields {
  headline: string;
  hyphenatedHeadline: boolean;
  imageLink: {
    title: string;
    filename: string;
    copyright: string;
  };
}

interface SampleComponentMappedProps {
  label: string;
  isActive: boolean;
  link: {
    url: string;
    title: string;
    extra: {
      name: string;
    };
  };
}

interface SampleComponentRestProps {
  link: {
    extra: {
      date: Date;
    };
  };
  target: {
    name: string;
    level?: number;
  };
  callback?: () => void;
  dateCreated: Date;
}

export function connectSampleComponentToCMS(
  cmsData: SampleComponentMappedCMSFields
) {
  return function enhance(
    Component: ComponentType<
      SampleComponentMappedProps & SampleComponentRestProps
    >
  ) {
    // restProps include also all the mapped props, but they are optional
    return function ConnectedComponent(restProps: SampleComponentRestProps) {
      const allProps = {
        ...restProps,
        label: cmsData.headline,
        isActive: cmsData.hyphenatedHeadline,
        link: {
          ...restProps.link,
          url: cmsData.imageLink.filename,
          title: cmsData.imageLink.title,
          extra: {
            ...restProps.link?.extra,
            name: cmsData.imageLink.copyright,
          },
        },
      };

      return <Component {...allProps} />;
    };
  };
}
