import { omit } from "lodash";

import { issueDocument, validateSchema } from "@govtechsg/open-attestation";

const sample = require("./sample.json");
const schema = require("./schema.json");

describe("schema/v1.0", () => {
  it("should be valid with sample document", () => {
    const issuedDocument = issueDocument(sample, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid with additonal key:value", () => {
    const issuedDocument = issueDocument({ ...sample, foo: "bar" }, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid without $template (will use default view)", () => {
    const document = omit(sample, "$template");
    const issuedDocument = issueDocument(document, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid without attachments", () => {
    const document = omit(sample, "attachments");
    const issuedDocument = issueDocument(document, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be invalid if $template does not have name or type", () => {
    const documentWithoutName = omit(sample, "$template.name");
    expect(() => {
      issueDocument(documentWithoutName, schema);
    }).toThrow("Invalid document");

    const documentWithoutType = omit(sample, "$template.type");
    expect(() => {
      issueDocument(documentWithoutType, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid with invalid template type", () => {
    const document = {
      ...sample,
      $template: {
        name: "CUSTOM_TEMPLATE",
        type: "INVALID_RENDERER"
      }
    };
    expect(() => {
      issueDocument(document, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid with invalid file type", () => {
    const document = {
      ...sample,
      attachments: [
        {
          filename: "sample.aac",
          type: "audio/aac",
          data: "BASE64_ENCODED_FILE"
        }
      ]
    };
    expect(() => {
      issueDocument(document, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid with invalid documentStore address", () => {
    const document = {
      ...sample,
      issuers: [
        {
          name: "DEMO STORE",
          documentStore: "Invalid Address"
        }
      ]
    };
    expect(() => {
      issueDocument(document, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid without issuer", () => {
    const documentWithoutKey = omit(sample, "issuers");
    expect(() => {
      issueDocument(documentWithoutKey, schema);
    }).toThrow("Invalid document");

    const documentWithZeroIssuer = { ...sample, issuers: [] };
    expect(() => {
      issueDocument(documentWithZeroIssuer, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid without documentStore in issuer", () => {
    const document = omit(sample, "issuers[0].documentStore");
    expect(() => {
      issueDocument(document, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid without attachments filename, type or data", () => {
    const documentWithoutName = omit(sample, "attachments[0].filename");
    expect(() => {
      issueDocument(documentWithoutName, schema);
    }).toThrow("Invalid document");

    const documentWithoutData = omit(sample, "attachments[0].data");
    expect(() => {
      issueDocument(documentWithoutData, schema);
    }).toThrow("Invalid document");

    const documentWithoutType = omit(sample, "attachments[0].type");
    expect(() => {
      issueDocument(documentWithoutType, schema);
    }).toThrow("Invalid document");
  });
});
