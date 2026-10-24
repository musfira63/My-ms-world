declare module 'mammoth' {
  export interface ConvertOptions {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
  }

  export interface Result {
    value: string; // The generated HTML
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export function convertToHtml(input: ConvertOptions): Promise<Result>;
  export function extractRawText(input: ConvertOptions): Promise<Result>;
}
