import algoliasearch from "algoliasearch/lite";
  import {
    Configure,
    InstantSearch,
    Hits,
    SearchBox,
    Pagination
  } from "react-instantsearch-dom";

  const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

const HitComponent = ({ hit }) => (
  <div className="hit">
    <h2>{hit.title}</h2>
  </div>
);

  const Page = () => (
    <>
      <InstantSearch searchClient={searchClient} indexName="agility_test">
        <Configure hitsPerPage={6} />
        <SearchBox />
        <Hits hitComponent={HitComponent} />
        <Pagination />
      </InstantSearch>
    </>
  );

  export default Page;
