import React from "react";

const RelatedPosts = ({customData, dynamicPageItem}) => {

    const {posts} = customData;
    const current = dynamicPageItem

    const relatedPosts = posts.filter((p) => {
        return p.categoryID === current.fields.category?.contentID
    })

    return (
        <>
            <h1>Related Posts!</h1>
            <div>
                {relatedPosts.map((post, index) => (
                    <h1 key={index}>{post.title}</h1>
                ))}
            </div>
        </>
    )

}

RelatedPosts.getCustomInitialProps = async function ({agility, channelName, languageCode}) {
    const api = agility;

    //get our posts
    let rawPosts = await api.getContentList({
        referenceName: 'posts',
        languageCode,
    });

    // get categories...
    let categories = await api.getContentList({
        referenceName: "categories",
        languageCode,
    });

    const posts = rawPosts.map((post) => {

        // categoryID
        const categoryID = post.fields.category?.contentid;

        // find category
        const category = categories?.find((c) => c.contentID === categoryID);

        return {
            contentID: post.contentID,
            categoryID: categoryID,
            title: post.fields.title,
        };

    });

    return {
        posts
    }
}

export default RelatedPosts;
