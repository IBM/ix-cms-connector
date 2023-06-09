/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import fs from "fs";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/preact";
import type { Documentation } from "react-docgen";
import { generateAdapterCode } from "./generateAdapterCode";
import { TSType } from "../const";
import { MappableProp } from "../types";

describe("generateAdapterCode()", () => {
  it("should return a generated HOC", () => {
    const componentDoc: Documentation = {
      displayName: "MyComponent",
    };

    const mappedProps1: [MappableProp, MappableProp] = [
      {
        name: "title",
        type: TSType.Null,
        isRequired: true,
      },
      {
        name: "header",
        type: TSType.String,
        isRequired: false,
      },
    ];

    const mappedProps2: [MappableProp, MappableProp] = [
      {
        name: "count",
        type: TSType.String,
        isRequired: true,
      },
      {
        name: "count",
        type: TSType.Number,
        isRequired: false,
      },
    ];

    const code = generateAdapterCode(componentDoc, [
      mappedProps1,
      mappedProps2,
    ]);

    expect(code).toContain(`function connect${componentDoc.displayName}ToCMS`);
    expect(code).toContain(
      `${mappedProps1[1].name}: cmsData.${mappedProps1[0].name} ?? undefined`
    );
    expect(code).toContain(
      `${mappedProps2[1].name}: Number(cmsData.${mappedProps2[0].name})`
    );
  });
});

describe("connectSampleComponentToCMS() - a generated HOC", async () => {
  it("should connect a component to CMS data and render it correctly", async () => {
    const cmsData = {
      title: "Tests",
      count: "3",
      flags: [true, false, true],
    };

    const SampleComponent = (props: {
      header?: string;
      count: number;
      indicators: boolean[];
      date: Date;
    }) => {
      return (
        <div>
          {props.header && <h1 data-testid="header">{props.header}</h1>}
          <ul data-testid="indicators">
            {props.indicators.map((i) => (
              <li>{i ? "+" : "-"}</li>
            ))}
          </ul>
          <div data-testid="typecheck">
            count is{" "}
            {typeof props.count === "number" ? "a number" : "not a number"}
          </div>
          <div data-testid="date">{props.date.getFullYear()}</div>
        </div>
      );
    };

    const componentDoc: Documentation = {
      displayName: "SampleComponent",
      props: {
        dummy: {
          // it's needed only for generating TS code later
          tsType: {
            name: "string",
          },
        },
      },
    };

    const mappedProps: [MappableProp, MappableProp][] = [
      [
        {
          name: "title",
          type: TSType.String,
          isRequired: true,
        },
        {
          name: "header",
          type: TSType.String,
          isRequired: false,
        },
      ],
      [
        {
          name: "count",
          type: TSType.String,
          isRequired: true,
        },
        {
          name: "count",
          type: TSType.Number,
          isRequired: true,
        },
      ],
      [
        {
          name: "flags",
          type: TSType.Array,
          subTypes: [TSType.Boolean],
          isRequired: true,
        },
        {
          name: "indicators",
          type: TSType.Array,
          subTypes: [TSType.Boolean],
          isRequired: true,
        },
      ],
    ];

    const code = generateAdapterCode(componentDoc, mappedProps, {
      usePreact: true,
      indentNumberOfSpaces: 2,
    });

    // now we need to save our code (a string) to the mock file
    fs.writeFile("./__mocks__/generatedAdapter.tsx", code, (err) => {
      if (err) {
        console.error(err);
      }

      // file was written successfully
    });

    // and import it as a module, we are ignoring a TS error here
    // cos it is fake and not a real module
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { connectSampleComponentToCMS } = await import("generatedAdapter");

    const ConnectedComponent =
      connectSampleComponentToCMS(cmsData)(SampleComponent);

    render(<ConnectedComponent date={new Date(2019, 1, 1)} />);

    const headerElement = screen.getByTestId("header");
    const indicatorsElement = screen.getByTestId("indicators");
    const typecheckElement = screen.getByTestId("typecheck");
    const dateElement = screen.getByTestId("date");

    expect(headerElement).toHaveTextContent("Tests");
    expect(within(indicatorsElement).getAllByText("+")).toHaveLength(2);
    expect(typecheckElement).toHaveTextContent("count is a number");
    expect(dateElement).toHaveTextContent("2019");
  });
});
