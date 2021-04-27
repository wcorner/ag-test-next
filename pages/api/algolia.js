import algoliasearch from "algoliasearch"
const client = algoliasearch("L53C3Z5689", "7a3e86c395c7607693964f84cd1c9766")

const algoliaHandler = async (req, res) => {
    const index = client.initIndex("posts")

    const { event, payload } = req.body
    const [_, eventType] = event.split(".")
    const { id: objectID, ...post } = payload

    if (eventType === "delete") {
        await index.deleteObject(objectID)
        return res.status(202).end()
    }

    if (["create", "update"].includes(eventType)) {
        await index.saveObject({ objectID, ...post })
        return res.status(200).send({ success: true })
    }

    res.send({
        message: `Event type ${eventType} is not a valid trigger`,
    })
}

export default algoliaHandler
