import { DropdownOption } from "../../components/atoms/Dropdown";
import { CMSProvider } from "../../components/organisms/CmsSchemaForm";

/* Get a list of components from a JSON according to the CMS provider 
in case of no component present returns an empty array. */
export function getComponentsFromJson(
  cmsProvider: CMSProvider,
  json: JSON
): DropdownOption[] {
  const componentsList = [];
  switch (cmsProvider) {
    case CMSProvider.STORYBLOK:
      componentsList.push(...getComponentsFromObj(json));
      break;
    case CMSProvider.MAGNOLIA:
      componentsList.push(...getComponentsFromObjMagnolia(json));
      break;
    default:
      break;
  }

  return componentsList;
}

/* Recursive function to get all the elements in the object 
based in the key components  and _uid */
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

/* Recursive function to get all the elements in the object 
based in the key components  and _uid */
export function getComponentsFromObjMagnolia(obj: object) {
  if (!obj) {
    return [];
  }

  const componentsList = [];
  const keys = Object.keys(obj);

  if (
    keys.includes("@nodeType") &&
    obj["@nodeType"] === "mgnl:component" &&
    keys.includes("@id")
  ) {
    componentsList.push({ label: obj["mgnl:template"], value: obj["@id"] });
  }

  keys.forEach((key: string) => {
    if (typeof obj[key] === "object") {
      const innerComponents = getComponentsFromObjMagnolia(obj[key]);
      componentsList.push(...innerComponents);
    }
  });

  return componentsList;
}

/* Extract part of Json based in the id of the component and CMS Provider */
export function getComponentFromJson(
  cmsProvider: CMSProvider,
  json: JSON,
  id: string
) {
  let component;
  switch (cmsProvider) {
    case CMSProvider.STORYBLOK:
      component = getComponentFromObj(json, id, "_uid");
      break;
    case CMSProvider.MAGNOLIA:
      component = getComponentFromObj(json, id, "@id");
      break;
    default:
      break;
  }

  return component;
}

/* Recursive function that returns part of a JSON based in the objKey pass as param */
export function getComponentFromObj(obj: object, id: string, objKey: string) {
  if (!obj) {
    return undefined;
  }

  const keys = Object.keys(obj);

  if (keys.includes(objKey) && obj[objKey] === id) {
    return obj;
  }

  for (const key of keys) {
    if (typeof obj[key] === "object") {
      const component = getComponentFromObj(obj[key], id, objKey);
      if (component) {
        return component;
      }
    }
  }

  return undefined;
}
