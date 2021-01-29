interface ContentTypeLibraryAssets {
  scripts: string[];
  styles: string[];
}

function requireContentType(kind: 'asset', id: string) : { 
  library: ContentTypeLibraryAssets, 
  core: ContentTypeLibraryAssets 
};

type asyncSchemaHash<T> = {
  [key in keyof T]: () => Promise<{ default: T[key] }>;
}

function requireContentType<T extends Record<string, unknown>>(kind: 'schema', id: string) : asyncSchemaHash<T>;

export default requireContentType;