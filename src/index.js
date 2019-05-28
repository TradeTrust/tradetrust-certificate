const {
    getData,
    issueDocument,
    issueDocuments,
    addSchema,
    verifySignature,
    validateSchema,
    obfuscateDocument,
    MerkleTree
  } = require("@tradetrust/tradetrust-attestation");
  
  /* eslint-disable global-require */
  // Disabling eslint for this because it doesn't make sense
  const schemas = {
    "1.0": require("../schema/1.0/schema.json")
  };
  /* eslint-enable global-require */
  
  const defaultSchema = schemas["1.0"];
  
  // Start - Initialise all valid schema
  addSchema(Object.values(schemas));
  // End - Initialise all valid schema
  
  const issueCertificate = data => issueDocument(data, defaultSchema);
  
  const issueCertificates = dataArray => issueDocuments(dataArray, defaultSchema);
  
  const obfuscateFields = (document, fields) =>
    obfuscateDocument(document, fields);
  
  const certificateData = document => getData(document);
  
  module.exports = {
    issueCertificate,
    issueCertificates,
    verifySignature,
    validateSchema,
    obfuscateFields,
    certificateData,
    schemas,
    defaultSchema,
    MerkleTree
  };