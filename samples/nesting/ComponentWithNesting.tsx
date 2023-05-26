export interface Props {
  propObject: {
    propString: string;
    propNestedObject: {
      propString: string;
      deepNestedPropObject: {
        propBoolean: boolean;
      };
    };
  };
  propString: string;
  propBoolean: boolean;
  propArrayOfString: string[];
  propUnion: null | string;
}

export const Component = (prop: Props) => {
  return <div />;
};
