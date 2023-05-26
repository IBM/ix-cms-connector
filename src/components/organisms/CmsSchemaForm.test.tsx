// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";

import { CmsSchemaForm } from "./CmsSchemaForm";

vi.mock("react-dropzone", () => ({
  useDropzone: () => ({
    getRootProps: vi.fn(),
    getInputProps: vi.fn(),
    isDragActive: vi.fn(),
  }),
}));

describe("CmsSchemaForm", () => {
  it("should render component", () => {
    const onGenerateSpy = vi.fn();
    render(<CmsSchemaForm onGenerate={onGenerateSpy} />);

    const element = screen.getByLabelText("CmsSchemaForm");
    expect(element).toBeInTheDocument();
  });

  it("should not render CMS's dropdown if no json is provider", () => {
    const onGenerateSpy = vi.fn();
    render(<CmsSchemaForm onGenerate={onGenerateSpy} />);

    const cmsDropdownEl = screen.queryByText("CMS");

    expect(cmsDropdownEl).not.toBeInTheDocument();
  });

  it("should not render component' dropdown if the components list is empty", () => {
    const onGenerateSpy = vi.fn();
    render(<CmsSchemaForm onGenerate={onGenerateSpy} />);

    const cmsDropdownEl = screen.queryByText("Component");

    expect(cmsDropdownEl).not.toBeInTheDocument();
  });

  it("should render form for CMS's endpoint", () => {
    const onGenerateSpy = vi.fn();
    render(<CmsSchemaForm onGenerate={onGenerateSpy}></CmsSchemaForm>);

    const radioButtonApiEl = screen.getByLabelText("API endpoint");
    fireEvent.click(radioButtonApiEl);

    const formEl = screen.getByLabelText("API endpoint cms");

    expect(formEl).toBeInTheDocument();
  });

  it("should render FileSelect", () => {
    const onGenerateSpy = vi.fn();
    render(<CmsSchemaForm onGenerate={onGenerateSpy}></CmsSchemaForm>);

    const radioButtonApiEl = screen.getByLabelText("JSON File upload");
    fireEvent.click(radioButtonApiEl);

    const formEl = screen.queryByLabelText("API endpoint cms");
    expect(formEl).not.toBeInTheDocument();

    const fileSelectEl = screen.getByLabelText("drop area");
    expect(fileSelectEl).toBeInTheDocument();
  });
});
