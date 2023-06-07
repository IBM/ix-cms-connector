export interface SampleComponentProps {
  label: string;
  isActive: boolean;
  link: {
    url: string;
    title: string;
    extra: {
      name: string;
      date: Date; // not mappable
    };
  };
  target: {
    name: string;
    level?: number;
  };
  callback?: () => void; // not mappable
  dateCreated: Date; // not mappable
}

export const SampleComponent = (props: SampleComponentProps) => {
  return (
    <div>
      <div>
        {props.label} - {props.dateCreated.toLocaleDateString()}
      </div>
      <a href={props.link.url}>{props.link.title}</a>
      <div>{props.isActive ? "Active" : "-"}</div>
    </div>
  );
};
