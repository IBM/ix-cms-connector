import { DropdownOption } from "../../components/atoms/Dropdown";
import { CMSProvider } from "../../components/organisms/CmsSchemaForm";

export function getComponentsFromJson(
  cmsProvider: CMSProvider,
  json: JSON
): DropdownOption[] {
  const componentsList = [];
  switch (cmsProvider) {
    case CMSProvider.STORYBLOK:
      componentsList.push(...getComponentsFromObj(json));
      break;

    default:
      break;
  }

  return componentsList;
}

export function getComponentsFromObj(obj: object) {
  if (!obj) {
    return [];
  }

  const componentsList = [];
  const keys = Object.keys(obj);

  if (keys.includes("component") && keys.includes("_uid")) {
    componentsList.push({ label: obj["component"], value: obj["_uid"] });
  }

  keys.forEach((key: string) => {
    if (typeof obj[key] === "object") {
      const innerComponents = getComponentsFromObj(obj[key]);
      componentsList.push(...innerComponents);
    }
  });

  return componentsList;
}

export function getComponentFromJson(
  cmsProvider: CMSProvider,
  json: JSON,
  id: string
) {
  let component;
  switch (cmsProvider) {
    case CMSProvider.STORYBLOK:
      component = getComponentFromObj(json, id);
      break;

    default:
      break;
  }

  return component;
}

export function getComponentFromObj(obj: object, id: string) {
  if (!obj) {
    return undefined;
  }

  const keys = Object.keys(obj);

  if (keys.includes("_uid") && obj["_uid"] === id) {
    return obj;
  }

  for (const key of keys) {
    if (typeof obj[key] === "object") {
      const component = getComponentFromObj(obj[key], id);
      if (component) {
        return component;
      }
    }
  }

  return undefined;
}
