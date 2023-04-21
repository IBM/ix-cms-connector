// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ComponentType } from "react";

// generated from the mapped CMS fields
interface SampleComponentMappedCMSFields {
  headline: string;
  hyphenatedHeadline: boolean;
}

// generated from the mapped component props
interface SampleComponentMappedProps {
  label: string;
  isActive: boolean;
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
      };

      const allProps = {
        ...mappedProps,
        ...restProps,
      } as P;

      return <Component {...allProps} />;
    };
  };
}
