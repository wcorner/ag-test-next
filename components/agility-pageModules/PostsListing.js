import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CategorySelect from "../common/CategorySelect";
import { motion, AnimatePresence } from "framer-motion"

const PostsListing = ({module, customData}) => {
    // get posts
    const {posts, categories, languageCode} = customData;

    let currentPosts = posts.slice(0,2);
    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [currentFilteredPosts, setCurrentFilteredPosts] = useState(currentPosts);
    const [currentPage, setCurrentPage] = useState(2);

    if (filteredPosts.length === currentFilteredPosts.length) {
        console.log('No more posts!');
    }

    function filterPosts(newValue) {

        setCurrentPage(2);

        if (newValue !== 'all') {
            let filtered = posts.filter((p) => {
                return p.categoryID === parseInt(newValue);
            })
            setFilteredPosts(filtered);
            setCurrentFilteredPosts(filtered.slice(0,currentPage))
        } else {
            setFilteredPosts(posts);
            setCurrentFilteredPosts(currentPosts);
        }

    }

    Array.prototype.unique = function() {
        let a = this.concat();
        for(let i=0; i<a.length; ++i) {
            for(let j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };

    function fetchPosts() {
        let morePosts = [];

        if (filteredPosts === posts) {
            console.log('not filtered');
            morePosts = posts.slice(currentPage,currentPage+2);
        } else {
            console.log('filtered');
            morePosts = filteredPosts.slice(currentPage,currentPage+2);
        }

        setCurrentPage(currentPage+2);

        setCurrentFilteredPosts(currentFilteredPosts.concat(morePosts).unique());

    }

    // set up href for internal links
    let href = "/pages/[...slug]";

    // if there are no posts, display message on frontend
    if (currentFilteredPosts.length <= 0) {
        return (
            <>
              <CategorySelect categories={categories} onChange={filterPosts} />
                <div className="mt-44 px-6 flex flex-col items-center justify-center">
                    <h1 className="text-3xl text-center font-bold">No posts available.</h1>
                    <div className="my-10">
                        <Link href={href} as="/home">
                            <a className="px-4 py-3 my-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition duration-300">
                                Return Home
                            </a>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <button onClick={fetchPosts}>Fetch Posts</button>
            <CategorySelect categories={categories} onChange={filterPosts} />
            <div className="relative px-8 mb-12">
                <div className="max-w-screen-xl mx-auto">
                    <div className="sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                        {currentFilteredPosts.map((post, index) => (

                            <Link href={href} as={post.url} key={index}>
                                <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <div className="flex-col group mb-8 md:mb-0">
                                        <div className="relative h-64">
                                            <Image
                                                src={post.imageSrc}
                                                alt={post.imageAlt}
                                                className="object-cover object-center rounded-t-lg"
                                                layout="fill"
                                            />
                                        </div>
                                        <div className="bg-gray-100 p-8 border-2 border-t-0 rounded-b-lg">
                                            <div className="uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose">
                                                {post.category}
                                            </div>
                                            <div className="border-b-2 border-primary-500 w-8"></div>
                                            <div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">
                                                {post.date}
                                            </div>
                                            <h2 className="text-secondary-500 mt-1 font-black text-2xl group-hover:text-primary-500 transition duration-300">
                                                {post.title}
                                            </h2>
                                        </div>
                                    </div>
                                </motion.a>
                            </Link>

                        ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
};

// function to resolve post urls
const resolvePostUrls = function (sitemap, posts) {
    let dynamicUrls = {};
    posts.forEach((post) => {
        Object.keys(sitemap).forEach((path) => {
            if (sitemap[path].contentID === post.contentID) {
                dynamicUrls[post.contentID] = path;
            }
        });
    });
    return dynamicUrls;
};

PostsListing.getCustomInitialProps = async ({ agility, channelName, languageCode }) => {
    // set up api
    const api = agility;

    try {
        // get sitemap...
        let sitemap = await api.getSitemap({
            channelName: channelName,
            languageCode,
        });

        // get posts...
        let rawPosts = await api.getContentList({
            referenceName: 'posts',
            take: 100,
            skip: 0,
            languageCode,
        });

        // get categories...
        let categories = await api.getContentList({
            referenceName: "categories",
            languageCode,
        });

        // resolve dynamic urls
        const dynamicUrls = resolvePostUrls(sitemap, rawPosts.items);

        const cleanPosts = rawPosts.items.map((post) => {
            // categoryID
            const categoryID = post.fields.category?.contentid;

            // find category
            const category = categories?.find((c) => c.contentID === categoryID);

            // date
            const date = new Date(post.fields.date).toLocaleDateString(languageCode);

            // url
            const url = dynamicUrls[post.contentID] || "#";

            // post image src
            let imageSrc = post.fields.image.url;

            // post image alt
            let imageAlt = post.fields.image?.label || null;

            return {
                contentID: post.contentID,
                title: post.fields.title,
                date,
                url,
                categoryID: categoryID,
                category: category?.fields.title || "Uncategorized",
                imageSrc,
                imageAlt,
            };
        });

        let posts = cleanPosts.sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            posts,
            categories,
            languageCode
        };

    } catch (error) {
        if (console) console.error(error);
    }

};

export default PostsListing;
