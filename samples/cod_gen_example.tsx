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

  delete mixedProps.name;
  delete mixedProps.isActive;

  const allProps: ComponentProps = { ...mixedProps, ...mappedProps };

  return <Component {...allProps} />;
};

// 2nd solution:

const hocAdapter = (contentProps: CMSProps) => {
  // we need to exclude props that we already applied
  // so the returned function will have only the rest of the props
  return function NewComponent(
    componentProps: Omit<ComponentProps, "label" | "isActive">
  ) {
    const mappedProps = {
      label: contentProps.name,
      isActive: contentProps.isActive,
    };

    const allProps: ComponentProps = { ...componentProps, ...mappedProps };

    return <Component {...allProps} />;
  };
};

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
hocAdapter(cmsData)(restProps);
// or
const NewComponent = hocAdapter(cmsData);

<NewComponent data={restProps.data} />;
