const {
  defaultSchemaVersion,
  issueDocument,
  issueDocuments,
  getData,
  validateSchema,
  obfuscateDocument
  // eslint-disable-next-line import/no-unresolved
} = require("../dist");

// eslint-disable-next-line import/no-dynamic-require
const sample = require(`../schema/${defaultSchemaVersion}/sample.json`);

it("can batch one document", () => {
  const document = issueDocument(sample);
  expect(document).toHaveProperty("signature.merkleRoot");
  expect(document).toHaveProperty("signature.targetHash");
  expect(document).toHaveProperty("signature.type");
  expect(document).toHaveProperty("schema");
  expect(document).toHaveProperty("data");
});

it("can batch multiple documents", () => {
  const documents = issueDocuments([sample, sample]);
  documents.forEach(document => {
    expect(document).toHaveProperty("signature.merkleRoot");
    expect(document).toHaveProperty("signature.targetHash");
    expect(document).toHaveProperty("signature.type");
    expect(document).toHaveProperty("schema");
    expect(document).toHaveProperty("data");
  });
});

it("can get data from issued document", () => {
  const document = issueDocument(sample);
  const data = getData(document);
  expect(data).toEqual(sample);
});

it("can validate schema of certificates", () => {
  const document = issueDocument(sample);
  const isValid = validateSchema(document);
  expect(isValid).toBe(true);
});

it("can obfuscate fields", () => {
  const keyToRemove = "unknownKey";
  const document = issueDocument(sample);
  const obfuscatedDocument = obfuscateDocument(document, keyToRemove);
  expect(document).toHaveProperty(`data.${keyToRemove}`);
  expect(obfuscatedDocument).not.toHaveProperty(`data.${keyToRemove}`);
  expect(obfuscatedDocument.privacy.obfuscatedData).toBeTruthy();
});
