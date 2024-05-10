import { authenticate } from "../shopify.server";
//import { json } from "@remix-run/node";
import { Page, Layout, Text, Tabs, Card, Link, Grid } from "@shopify/polaris";
//import { useState, useCallback } from "react";
import {
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";

//const NUM_OF_PRODUCT_DISPLAYED = 6;

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  const { productList, nextpageInfo } = await collectionContent(
    params.name,
    admin.graphql,
  );
  return { productList, nextpageInfo };
}

async function collectionContent(collectionhandle, graphql) {
  console.log(collectionhandle);
  const collectionContentQuery = `query ($collectionhandle: String!, $numProducts: Int!, $cursorpos: String){ 
    collectionByHandle(handle: $collectionhandle){
    products(first: $numProducts,  after: $cursorpos){  
    edges{
        node{
        id
        title
        handle
        createdAt
        images (first: 1){
            edges {
                node {
                  id
                  url
                }             
            }    
        }
        }
    }
    pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
        }
        }
    }
    }`;

  const collectionContentQueryVariables = {
    variables: {
      collectionhandle: collectionhandle,
      numProducts: 250,
      cursorpos: null,
    },
  };
  const response = await graphql(
    collectionContentQuery,
    collectionContentQueryVariables,
  );
  //console.log(response);
  const data = await response.json();
  console.log(data);
  const productList1 = data.data.collectionByHandle.products.edges.map(
    (product, idx, arr) => {
      // if (
      //   idx < NUM_OF_PRODUCT_DISPLAYED * (pageNumber - 1) ||
      //   idx >=
      //     NUM_OF_PRODUCT_DISPLAYED * (pageNumber - 1) + NUM_OF_PRODUCT_DISPLAYED
      // )
      //   return;
      return {
        id: product?.node?.id,
        title: product?.node?.title,
        handle: product?.node?.handle,
        createdAt: product?.node?.createdAt,
        image: product?.node?.images?.edges[0]?.node?.url,
      };
    },
  );
  //const cursorsPos = getCursors(data1);
  const nextpageInfo = data.data.collectionByHandle.products.pageInfo;
  //console.log(nextpageInfo);
  const productList = productList1.filter((item) => item !== undefined);
  //const productList = productList1;
  console.log(productList);
  console.log(nextpageInfo);
  return { productList, nextpageInfo };
  //return json(data);
}
export default function CollectionProducts() {
  const { productList, nextpageInfo } = useLoaderData();
  console.log("productlist");
  console.log(productList);
  return (
    <Page>
      <Layout>
        {productList?.map((product, index) => (
          <Layout.Section variant="oneThird" key={product.id}>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
                <Card>
                  <Text as="h3" variant="headingMd">
                    {product.id}
                  </Text>
                  <Text as="h3" variant="headingMd">
                    {product?.title && product.title}
                  </Text>

                  <img
                    alt=""
                    width="50%"
                    height="50%"
                    src={product?.image && product.image}
                  ></img>
                </Card>
              </Grid.Cell>
            </Grid>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
}
