// Don't forget to import!
import { ComponentType } from "react";

// generated from the mapped CMS fields
interface MappedCMSFields {
  headline: string;
  hyphenatedHeadline: boolean;
}

// generated from the mapped component props
interface MappedComponentProps {
  label: string;
  isActive: boolean;
}

export function connectSampleComponentToCMS(cmsData: MappedCMSFields) {
  return function enhance<P extends MappedComponentProps>(
    Component: ComponentType<P>
  ) {
    // restProps actullay includes also all the mapped props,
    // but they are optional now
    return function ConnectedComponent(
      restProps: Omit<P, keyof MappedComponentProps> &
        Partial<MappedComponentProps>
    ) {
      const mappedProps: MappedComponentProps = {
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
