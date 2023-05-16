// @vitest-environment jsdom

import { it, expect, describe, vi } from "vitest";

import { render, screen, fireEvent } from "@testing-library/preact";

import { Property } from "./Property";
import { MappableProp, PropSource, TSType } from "../../utils";

describe("Property", () => {
  it("should display a Property Component", () => {
    const simpleProp: MappableProp = {
      name: "test_property",
      type: TSType.String,
      isRequired: true,
    };
    render(<Property propData={simpleProp} source={PropSource.CMS} />);

    const propEl = screen.getByText(simpleProp.name);

    expect(propEl).toBeInTheDocument();
  });

  it("should include the required * flag", () => {
    const simpleProp: MappableProp = {
      name: "test_property",
      type: TSType.String,
      isRequired: true,
    };
    render(<Property propData={simpleProp} source={PropSource.CMS} />);

    const propEl = screen.getByText("*");

    expect(propEl).toBeInTheDocument();
  });

  it("should NOT include the required * flag", () => {
    const simpleProp: MappableProp = {
      name: "test_property",
      type: TSType.String,
      isRequired: false,
    };
    render(<Property propData={simpleProp} source={PropSource.CMS} />);

    const propEl = screen.queryByText("*");

    expect(propEl).not.toBeInTheDocument();
  });

  it("should include a number array tag", () => {
    const arrayProp: MappableProp = {
      name: "test_array_property",
      type: TSType.Array,
      subTypes: [TSType.Number],
      isRequired: true,
    };
    render(<Property propData={arrayProp} source={PropSource.CMS} />);

    const propEl = screen.getByText(TSType.Number + "[]");

    expect(propEl).toBeInTheDocument();
  });

  it("should include a tag for string and null", () => {
    const unionProp: MappableProp = {
      name: "test_union_property",
      type: TSType.Union,
      subTypes: [TSType.String, TSType.Null],
      isRequired: true,
    };
    render(<Property propData={unionProp} source={PropSource.CMS} />);

    const stringEl = screen.getByText(TSType.String);
    const nullEl = screen.getByText(TSType.Null);

    expect(stringEl).toBeInTheDocument();
    expect(nullEl).toBeInTheDocument();
  });

  it("should invoke onDragStart when dragged", () => {
    const simpleProp: MappableProp = {
      name: "test_property",
      type: TSType.String,
      isRequired: true,
    };

    const handleDragSpy = vi.fn();

    render(
      <Property
        propData={simpleProp}
        source={PropSource.CMS}
        onDragStart={handleDragSpy}
      />
    );

    const propEl = screen.getByText(simpleProp.name);
    const rootEl = propEl.parentElement.parentElement;

    fireEvent.dragStart(rootEl);

    expect(handleDragSpy).toBeCalled();
  });

  it("should invoke onClick when clicked", () => {
    const simpleProp: MappableProp = {
      name: "test_property",
      type: TSType.String,
      isRequired: true,
    };

    const handleClickSpy = vi.fn();

    render(
      <Property
        propData={simpleProp}
        source={PropSource.CMS}
        onClick={handleClickSpy}
      />
    );

    const propEl = screen.getByText(simpleProp.name);
    const rootEl = propEl.parentElement.parentElement;

    fireEvent.click(rootEl);

    expect(handleClickSpy).toBeCalled();
  });
});
