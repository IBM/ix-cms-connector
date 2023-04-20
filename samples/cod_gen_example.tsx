import { ComponentProps } from "react";

interface CMSData {
  name: string;
  isActive: boolean;
}

interface MyComponentProps {
  label: string;
  isActive: boolean;
  data: Record<string, symbol>;
}

// our sample component:

const MyComponent = (props: MyComponentProps) => {
  return (
    <div>
      <div>
        {props.label} - {JSON.stringify(props.data)}
      </div>
      <div>{props.isActive ? "V" : "-"}</div>
    </div>
  );
};

// 1st solution:

const WrapperAdapter = (
  mixedProps: CMSData & Omit<MyComponentProps, "label" | "isActive">
) => {
  const mappedProps = {
    label: mixedProps.name,
    isActive: mixedProps.isActive,
  };

  // data mutation! not a really good aproach
  delete mixedProps.name;
  delete mixedProps.isActive;

  const allProps: MyComponentProps = { ...mixedProps, ...mappedProps };

  return <MyComponent {...allProps} />;
};

// 2nd solution:

// Don't forget to import React.ComponentProps!
// import { ComponentProps } from "react";

function connectMyComponentToCMS(cmsData: CMSData) {
  return function (Component: typeof MyComponent) {
    return function CMSMyComponent(
      componentProps: Omit<
        ComponentProps<typeof MyComponent>,
        "label" | "isActive"
      > &
        Partial<Pick<ComponentProps<typeof MyComponent>, "label" | "isActive">>
    ) {
      const mappedCMSProps = {
        label: cmsData.name,
        isActive: cmsData.isActive,
      };

      const allProps: ComponentProps<typeof MyComponent> = {
        ...mappedCMSProps,
        ...componentProps,
      };

      return <Component {...allProps} />;
    };
  };
}

// usage examples:

const cmsData: CMSData = { name: "Description", isActive: true };
const restProps = {
  data: { key: Symbol() },
};

// 1st:
<WrapperAdapter
  name={cmsData.name}
  isActive={cmsData.isActive}
  data={restProps.data}
/>;

// 2nd:
function ExampleApp() {
  const CMSComponent = connectMyComponentToCMS(cmsData)(MyComponent);

  return (
    <>
      <CMSComponent data={restProps.data} />
    </>
  );
}
