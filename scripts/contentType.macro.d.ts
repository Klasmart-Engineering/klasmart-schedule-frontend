interface ContentTypeLibraryAssets {
  scripts: string[];
  styles: string[];
}

export default function requireContentType(id: string) : { 
  library: ContentTypeLibraryAssets, 
  core: ContentTypeLibraryAssets 
};