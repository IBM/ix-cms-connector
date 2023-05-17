import { MappableProp } from "../utils";
import { canMapProps } from "../utils/funcs/getPropsConverter";

export type StagedProp = [MappableProp | null, MappableProp | null];

export enum StagedPropsActionTypes {
  ADD_PROPS,
  REMOVE_PROPS,
  AUTO_MAP_PROPS,
}

type StagedPropsAction =
  | {
      type: StagedPropsActionTypes.ADD_PROPS;
      cmsProp: MappableProp | null;
      compProp: MappableProp | null;
      index: number;
    }
  | {
      type: StagedPropsActionTypes.REMOVE_PROPS;
      cmsProp: MappableProp | null;
      compProp: MappableProp | null;
    }
  | {
      type: StagedPropsActionTypes.AUTO_MAP_PROPS;
      cmsProps: MappableProp[];
      compProps: MappableProp[];
    };

const isSamePropName = (
  propA: MappableProp | null,
  propB: MappableProp | null
) => {
  if (!propA || !propB) {
    return false;
  }
  return propA.name === propB.name;
};

export function stagedPropsReducer(
  state: StagedProp[],
  action: StagedPropsAction
): StagedProp[] {
  switch (action.type) {
    case StagedPropsActionTypes.ADD_PROPS: {
      const { cmsProp, compProp, index } = action;

      if (state.length === 0) {
        return [[cmsProp, compProp]];
      }

      const copy = [...state];

      // step 1 remove already staged props to prevent duplicates
      const cmsIndex = copy.findIndex((row) => isSamePropName(cmsProp, row[0]));
      const compIndex = copy.findIndex((row) =>
        isSamePropName(compProp, row[1])
      );

      if (cmsIndex != -1) {
        copy[cmsIndex][0] = null;
      }

      if (compIndex != -1) {
        copy[compIndex][1] = null;
      }

      // step 2 stage props
      // if row at index is empty after step 1, overwrite row
      const rowIsEmpty = !copy[index][0] && !copy[index][1];
      if (rowIsEmpty) {
        copy[index] = [cmsProp, compProp];
      }

      // else add new row at index
      else {
        copy.splice(index, 0, [cmsProp, compProp]);
      }

      // filter empty rows
      return copy.filter(([cmsProp, compProp]) => !!cmsProp || !!compProp);
    }

    case StagedPropsActionTypes.REMOVE_PROPS: {
      const { cmsProp, compProp } = action;
      const copy = [...state];
      const cmsIndex = copy.findIndex((row) => isSamePropName(cmsProp, row[0]));
      const compIndex = copy.findIndex((row) =>
        isSamePropName(compProp, row[1])
      );

      if (cmsIndex != -1) {
        copy[cmsIndex][0] = null;
      }

      if (compIndex != -1) {
        copy[compIndex][1] = null;
      }

      // filter empty rows
      return copy.filter(([cmsProp, compProp]) => !!cmsProp || !!compProp);
    }

    case StagedPropsActionTypes.AUTO_MAP_PROPS: {
      const { cmsProps, compProps } = action;
      const autoMappedProps: StagedProp[] = [];
      cmsProps.forEach((cmsProp) => {
        const matchedComponentProp = compProps.find((compProp) =>
          isSamePropName(cmsProp, compProp)
        );
        if (
          matchedComponentProp &&
          canMapProps(cmsProp, matchedComponentProp)
        ) {
          autoMappedProps.push([cmsProp, matchedComponentProp]);
        }
      });
      return autoMappedProps;
    }
  }
}
