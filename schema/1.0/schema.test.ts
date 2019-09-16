import { omit, merge } from "lodash";

import { issueDocument, validateSchema } from "@govtechsg/open-attestation";

const sampleDoc = require("./sample-document.json");
const sampleToken = require("./sample-token.json");
const schema = require("./schema.json");

describe("schema/v1.0", () => {
  it("should be valid with sample document", () => {
    const issuedDocument = issueDocument(sampleDoc, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be invalid if identity type is other than DNS-TXT", () => {
    const document = merge(sampleDoc, {
      issuers: [
        {
          identityProof: {
            type: "ABC",
            location: "http:abc.com"
          }
        }
      ]
    });
    expect(() => {
      issueDocument(document, schema);
    }).toThrow("Invalid document");
  });

  it("should be valid if identity type is DNS-TXT", () => {
    const document = merge(sampleDoc, {
      issuers: [
        {
          identityProof: {
            type: "DNS-TXT",
            location: "http:abc.com"
          }
        }
      ]
    });
    const issuedDocument = issueDocument(document, schema);
    expect(validateSchema(issuedDocument)).toBe(true);
  });

  it("should be valid with sample token", () => {
    const issuedToken = issueDocument(sampleToken, schema);
    const valid = validateSchema(issuedToken);

    expect(valid).toBe(true);
  });

  it("should not be valid with document with both documentStore and tokenRegistry", () => {
    expect(() => {
      issueDocument(
        {
          ...sampleToken,
          issuers: [
            {
              name: "DEMO STORE",
              documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
            }
          ]
        },
        schema
      );
    }).toThrow("Invalid document");
  });

  it("should be valid with additonal key:value", () => {
    const issuedDocument = issueDocument({ ...sampleDoc, foo: "bar" }, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid without $template (will use default view)", () => {
    const document = omit(sampleDoc, "$template");
    const issuedDocument = issueDocument(document, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid without attachments", () => {
    const document = omit(sampleDoc, "attachments");
    const issuedDocument = issueDocument(document, schema);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be invalid if $template does not have name or type", () => {
    const documentWithoutName = omit(sampleDoc, "$template.name");
    expect(() => {
      issueDocument(documentWithoutName, schema);
    }).toThrow("Invalid document");

    const documentWithoutType = omit(sampleDoc, "$template.type");
    expect(() => {
      issueDocument(documentWithoutType, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid with invalid template type", () => {
    const document = {
      ...sampleDoc,
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
      ...sampleDoc,
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
      ...sampleDoc,
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
    const documentWithoutKey = omit(sampleDoc, "issuers");
    expect(() => {
      issueDocument(documentWithoutKey, schema);
    }).toThrow("Invalid document");

    const documentWithZeroIssuer = { ...sampleDoc, issuers: [] };
    expect(() => {
      issueDocument(documentWithZeroIssuer, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid without documentStore in issuer", () => {
    const document = omit(sampleDoc, "issuers[0].documentStore");
    expect(() => {
      issueDocument(document, schema);
    }).toThrow("Invalid document");
  });

  it("should be invalid without attachments filename, type or data", () => {
    const documentWithoutName = omit(sampleDoc, "attachments[0].filename");
    expect(() => {
      issueDocument(documentWithoutName, schema);
    }).toThrow("Invalid document");

    const documentWithoutData = omit(sampleDoc, "attachments[0].data");
    expect(() => {
      issueDocument(documentWithoutData, schema);
    }).toThrow("Invalid document");

    const documentWithoutType = omit(sampleDoc, "attachments[0].type");
    expect(() => {
      issueDocument(documentWithoutType, schema);
    }).toThrow("Invalid document");
  });
});
