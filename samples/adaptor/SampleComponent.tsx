export interface SampleComponentProps {
  label: string;
  isActive: boolean;
  dateCreated: Date; // complex type
}

export const SampleComponent = (props: SampleComponentProps) => {
  return (
    <div>
      <div>
        {props.label} - {props.dateCreated.toLocaleDateString()}
      </div>
      <div>{props.isActive ? "Active" : "-"}</div>
    </div>
  );
};
