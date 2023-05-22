import { ComponentType } from "preact";

interface MyComponentMappedCMSFields {
    title: null;
    count: string;
}

interface MyComponentMappedProps {
    header?: string;
    count?: number;
}

export function connectMyComponentToCMS(cmsData: MyComponentMappedCMSFields) {
    return function enhance<P extends MyComponentMappedProps>(
        Component: ComponentType<P>
    ) {
        return function ConnectedComponent(
            restProps: Omit<P, keyof MyComponentMappedProps> & Partial<MyComponentMappedProps>
        ) {
            const mappedProps: MyComponentMappedProps = {
                header: cmsData.title ?? undefined,
                count: Number(cmsData.count),
            };

            const allProps = {
                ...mappedProps,
                ...restProps,
            } as P;

            return <Component {...allProps} />;
        };
    };
}