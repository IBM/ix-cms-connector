export interface SampleComponentProps {
  label: string;
  isActive: boolean;
  link: {
    url: string;
    title: string;
  };
  dateCreated: Date; // complex type
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
