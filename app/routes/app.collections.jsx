// import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, Outlet } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Text,
  Tabs,
  Card,
  Link,
  Grid,
  Pagination,
  Button,
  BlockStack,
  Box,
  List,
  InlineStack,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const { collectionList } = await collectionName(admin.graphql);
  return { collectionList };
}

async function collectionName(graphql) {
  const collectionQuery = `query  {
        collections(first: 250) {
          edges {
            node {
              id
              title
              handle
              updatedAt
              sortOrder
              image{
                id
                url
              }
            }
          }
        }
    }`;
  const response = await graphql(collectionQuery);
  const data = await response.json();
  //console.log(data);
  const collectionList = data.data.collections.edges.map((collection) => {
    return {
      id: collection?.node?.id,
      title: collection?.node?.title,
      url: collection?.node?.image?.url,
      handle: collection?.node?.handle,
    };
  });

  //console.log(collectionList);
  return { collectionList };
}

export default function Collection() {
  const { collectionList } = useLoaderData();
  // console.log("collectionList");
  // console.log(collectionList);
  const [selected, setSelected] = useState(0);
  const [url, setUrl] = useState(0);
  //const [] = useState(0);
  const navigate = useNavigate();

  const tabs = collectionList.map((collection) => ({
    id: collection.id,
    content: collection.title,
    imagesrc: collection?.url ? collection?.url : null,
    handle: collection.handle,
    //handle: "fitness-apparel",
  }));
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setUrl(collectionList[selectedTabIndex].url);
    navigate(
      "/app/collections/" + collectionList[selectedTabIndex].handle + "/1",
    );
  }, []);

  return (
    <Page>
      <Layout>
        <Card>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
            fitted
          >
            {/* <img
              alt=""
              width="50%"
              height="50%"
              src={url && url}
              onClick={() => navigate("/app/products/1")}
            ></img> */}
            <Outlet />
          </Tabs>
        </Card>
      </Layout>
    </Page>
  );
}
