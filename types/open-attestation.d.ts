declare module "@govtechsg/open-attestation" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;

  export function getData(document: any): any;
  export function issueDocument(document: any, schema: any): any;
  export function issueDocuments(documents: any[], schema: any): any[];

  export function digestDocument(document: any): string;
  export function addSchema(schema: any): void;

  export function obfuscateDocument(
    document: any,
    fields: string | string[]
  ): any;

  export function validateSchema(document: any): boolean;
  export function verifySignature(document: any): boolean;

  // Below functions were also exported by OpenAttestaion but have yet to be exported
  // out of this package. If there are need to use these low level functions, they can
  // be typed and exported in the future.

  // sign
  // MerkleTree
  // checkProof
  // utils
}
