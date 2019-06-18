import {
  issueDocument as issueDocumentWithSchema,
  issueDocuments as issueDocumentsWithSchema,
  addSchema
} from "@govtechsg/open-attestation";

/* eslint-disable global-require */
// Disabling eslint for this because it doesn't make sense
export const schemas = {
  "1.0": require("../schema/1.0/schema.json")
};
/* eslint-enable global-require */

export const defaultSchemaVersion = "1.0";
export const defaultSchema = schemas[defaultSchemaVersion];

// Start - Initialise all valid schema
addSchema(Object.values(schemas));
// End - Initialise all valid schema

export const issueDocument = (data: any) =>
  issueDocumentWithSchema(data, defaultSchema);

export const issueDocuments = (dataArray: any) =>
  issueDocumentsWithSchema(dataArray, defaultSchema);

// Re-export functions from OA directly
export {
  getData,
  verifySignature,
  validateSchema,
  obfuscateDocument
} from "@govtechsg/open-attestation";
