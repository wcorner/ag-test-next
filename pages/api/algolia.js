import algoliasearch from "algoliasearch";
import agility from "@agility/content-fetch"

const algoliaHandler = async (req, res) => {

  const payload = req.body;

  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
    isPreview: false
  });

  const algolia = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);
  const index = algolia.initIndex('agility_test')

  try {
    let rawPosts = await api.getContentList({
      referenceName: 'posts',
      take: 50,
      skip: 0,
      languageCode: 'en-us',
    });

    let rawPages = await api.getSyncPages({
      languageCode: 'en-us',
      pageSize: 500,
      syncToken: 0,
    });

    const cleanPosts = rawPosts.items.map((post) => {
      return {
        objectID: post.contentID,
        type: 'post',
        title: post.fields.title,
        content: post.fields.content
      }
    });

    const cleanPages = rawPages.items.map((page) => {
      return {
        objectID: page.pageID,
        type: 'page',
        title: page.title,
        content: page.seo.metaDescription
      }
    });

    let allObjects = cleanPosts.concat(cleanPages);

    await index.saveObjects(allObjects);

    res.status(200).json({ state: payload.state })

  } catch (error) {
    if (console) console.error(error);
  }

}

export default algoliaHandler

