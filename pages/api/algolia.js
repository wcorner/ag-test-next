import algoliasearch from "algoliasearch"
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)

const algoliaHandler = async (req, res) => {
    const index = client.initIndex("posts")

    const { payload } = req.body
    const { pageID: objectID, ...post } = payload

    if (["Published"].includes(state)) {
        await index.saveObject({ objectID, ...post })
        return res.status(200).send({ success: true })
    }

    res.send({
        message: `${state} is not a valid trigger`,
    })
}

export default algoliaHandler
