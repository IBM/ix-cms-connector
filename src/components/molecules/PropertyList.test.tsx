/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import { it, expect, describe, vi } from "vitest";

import { render, screen, fireEvent } from "@testing-library/preact";

import { PropertyList } from "./PropertyList";
import { MappableProp, PropSource, TSType } from "../../utils";

const testList: MappableProp[] = [
  {
    name: "string-test",
    type: TSType.String,
    isRequired: true,
  },
  {
    name: "number-test",
    type: TSType.Number,
    isRequired: true,
  },
  {
    name: "boolean-test",
    type: TSType.Boolean,
    isRequired: true,
  },
  {
    name: "string-array-test",
    type: TSType.Array,
    subTypes: [TSType.String],
    isRequired: true,
  },
  {
    name: "union-test",
    type: TSType.Union,
    subTypes: [TSType.String, TSType.Undefined],
    isRequired: false,
  },
];

describe("PropertyList", () => {
  it("should display a list of Properties", () => {
    render(
      <PropertyList
        list={testList}
        source={PropSource.CMS}
        onPropertyDragStart={() => 0}
        onPropertyClick={() => 0}
        onDropOnProperty={() => 0}
      />
    );

    const [outterListEl] = screen.getAllByRole("list");

    expect(outterListEl).toBeInTheDocument();
  });

  it("should invoke the onPropertyDragStart handler when a property is dragged", () => {
    const propertyListSpy = vi.fn();

    render(
      <PropertyList
        list={testList}
        source={PropSource.CMS}
        onPropertyDragStart={propertyListSpy}
        onPropertyClick={() => 0}
        onDropOnProperty={() => 0}
      />
    );

    const stringPropertyEl =
      screen.getByText("string-test").parentElement.parentElement;
    fireEvent.dragStart(stringPropertyEl);

    expect(propertyListSpy).toBeCalled();
  });

  it("should invoke the onPropertyClick handler when a property is clicked", () => {
    const propertyListSpy = vi.fn();

    render(
      <PropertyList
        list={testList}
        source={PropSource.CMS}
        onPropertyDragStart={() => 0}
        onPropertyClick={propertyListSpy}
        onDropOnProperty={() => 0}
      />
    );

    const stringPropertyEl =
      screen.getByText("string-test").parentElement.parentElement;
    fireEvent.click(stringPropertyEl);

    expect(propertyListSpy).toBeCalled();
  });

  it("should invoke the onDropOnProperty handler when a property with different source is dropped", () => {
    const propertyListSpy = vi.fn();

    const draggingProp = {
      propData: {
        name: "dragging-test",
        type: TSType.String,
        isRequired: true,
      },
      source: PropSource.COMPONENT, // different then list source
    };

    render(
      <PropertyList
        list={testList}
        source={PropSource.CMS}
        draggingProp={draggingProp}
        onPropertyDragStart={() => 0}
        onPropertyClick={() => 0}
        onDropOnProperty={propertyListSpy}
      />
    );

    const stringPropertyListEl =
      screen.getByText("string-test").parentElement.parentElement.parentElement;

    fireEvent.drop(stringPropertyListEl);

    expect(propertyListSpy).toBeCalled();
  });

  it("should NOT invoke the onDropOnProperty handler when a property with same source is dropped", () => {
    const propertyListSpy = vi.fn();

    const draggingProp = {
      propData: {
        name: "dragging-test",
        type: TSType.String,
        isRequired: true,
      },
      source: PropSource.CMS, // same than list source
    };

    render(
      <PropertyList
        list={testList}
        source={PropSource.CMS}
        draggingProp={draggingProp}
        onPropertyDragStart={() => 0}
        onPropertyClick={() => 0}
        onDropOnProperty={propertyListSpy}
      />
    );

    const stringPropertyListEl =
      screen.getByText("string-test").parentElement.parentElement.parentElement;

    fireEvent.drop(stringPropertyListEl);

    expect(propertyListSpy).not.toBeCalled();
  });

  it("should NOT invoke the onDropOnProperty handler when a property with different source is dropped but is not compatible", () => {
    const propertyListSpy = vi.fn();

    const draggingProp = {
      propData: {
        name: "dragging-test",
        type: TSType.Union,
        subTypes: [TSType.Boolean, TSType.Undefined],
        isRequired: false,
      },
      source: PropSource.COMPONENT,
    };

    render(
      <PropertyList
        list={testList}
        source={PropSource.CMS}
        draggingProp={draggingProp}
        onPropertyDragStart={() => 0}
        onPropertyClick={() => 0}
        onDropOnProperty={propertyListSpy}
      />
    );

    const stringPropertyListEl =
      screen.getByText("string-test").parentElement.parentElement.parentElement;

    fireEvent.drop(stringPropertyListEl);

    expect(propertyListSpy).not.toBeCalled();
  });
});
