interface CMSProps {
  name: string;
  isActive: boolean;
}

interface ComponentProps {
  label: string;
  isActive: boolean;
  data: Record<string, symbol>;
}

// our sample component:

const Component = (props: ComponentProps) => {
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
  mixedProps: CMSProps & Omit<ComponentProps, "label" | "isActive">
) => {
  const mappedProps = {
    label: mixedProps.name,
    isActive: mixedProps.isActive,
  };

  // data mutation! not a really good aproach
  delete mixedProps.name;
  delete mixedProps.isActive;

  const allProps: ComponentProps = { ...mixedProps, ...mappedProps };

  return <Component {...allProps} />;
};

// 2nd solution:

function connectComponentToCMS(cmsProps: CMSProps) {
  // we need to exclude props that we already applied
  // so the returned function will have only the rest props
  return function CMSComponent(
    componentProps: Omit<ComponentProps, "label" | "isActive"> &
      Partial<Pick<ComponentProps, "label" | "isActive">>
  ) {
    const mappedCMSProps = {
      label: cmsProps.name,
      isActive: cmsProps.isActive,
    };

    const allProps: ComponentProps = {
      ...mappedCMSProps,
      ...componentProps,
    };

    return <Component {...allProps} />;
  };
}

// usage examples:

const cmsData: CMSProps = { name: "Description", isActive: true };
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
connectComponentToCMS(cmsData)(restProps);

// or
const CMSComponent = connectComponentToCMS(cmsData);

<CMSComponent data={restProps.data} />;
