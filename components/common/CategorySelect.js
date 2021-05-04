import React, { useState } from "react";

const CategorySelect = ({ categories, onChange }) => {

    function filterPosts(event) {
        onChange(event.target.value);
    }

    return (
        <select name="" id="" onChange={filterPosts}>
            <option value="all">All Posts</option>
            {categories.map((category, index) => (
                <option key={index} value={category.contentID}>{category.fields.title}</option>
            ))}
        </select>
    )
}
export default CategorySelect;
