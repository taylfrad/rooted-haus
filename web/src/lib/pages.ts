import { getCollection, type CollectionEntry } from 'astro:content';

type PageCollection = 'homePage' | 'ritualsPage' | 'teamPage' | 'experiencePage' | 'galleryPage' | 'connectPage' | 'careersPage';

/** A page's editable text and photos: the single file behind that page collection (src/content/pages/<name>.yml). */
export async function getPage<C extends PageCollection>(collection: C): Promise<CollectionEntry<C>['data']> {
  const [entry] = await getCollection(collection);
  if (!entry) throw new Error(`No content file for ${collection} in src/content/pages/`);
  return entry.data;
}
