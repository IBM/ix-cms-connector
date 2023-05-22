// @vitest-environment jsdom

import { CMSProvider } from "src/components/organisms/CmsSchemaForm";
import { describe, it, expect } from "vitest";
import {
  getComponentFromJson,
  getComponentFromObj,
  getComponentsFromJson,
  getComponentsFromObj,
} from "./componentFromJson";

const mockJsonStoryBlok = {
  story: {
    name: "test",
    content: {
      _uid: "000",
      body: [
        {
          component: "component test 1",
          _uid: "001",
        },
        {
          component: "component test 2",
          _uid: "002",
        },
        {
          component: "component test 3",
          _uid: "003",
        },
        {
          inner: [
            {
              component: " component test 4.1",
              _uid: "041",
            },
            {
              component: "component test 4.2",
              _uid: "042",
            },
            {
              component: "component test 4.3",
              _uid: "043",
            },
          ],
          component: " component test 4",
          _uid: "004",
        },
      ],
      component: "page",
    },
  },
};

describe("getComponentsFromJson", () => {
  it("should return an empty array if the CMSProvider is different from StoryBlok", () => {
    const components = getComponentsFromJson(
      CMSProvider.MAGNOLIA,
      mockJsonStoryBlok as unknown as JSON
    );

    expect(components).toStrictEqual([]);
  });
});

describe("getComponentsFromObj", () => {
  it("should return list of objects of an expected length", () => {
    const components = getComponentsFromObj(mockJsonStoryBlok);
    expect(components.length).toBe(8);
  });

  it("should return a empty array if the obj is empty", () => {
    const components = getComponentsFromObj({ prop: "1", prop1: "3" });
    expect(components.length).toBe(0);
  });
});

describe("getComponentFromJson", () => {
  it("should return undefined if the obj is not from  Storyblok", () => {
    const component = getComponentFromJson(
      CMSProvider.MAGNOLIA,
      mockJsonStoryBlok as unknown as JSON,
      "00"
    );

    expect(component).toBeUndefined();
  });
});

describe("getComponentFromObj", () => {
  it("should return undefined if the obj is empty", () => {
    const component = getComponentFromObj({}, "001");

    expect(component).toBeUndefined();
  });

  it("should return undefined if the id is not present", () => {
    const component = getComponentFromObj(
      mockJsonStoryBlok as unknown as JSON,
      "5"
    );

    expect(component).toBeUndefined();
  });

  it("should return the partial object from JSON when the id is correct", () => {
    const component = getComponentFromObj(
      mockJsonStoryBlok as unknown as JSON,
      "001"
    );

    expect(component._uid).toBe("001");
    expect(component).toBeTypeOf("object");
  });
});
