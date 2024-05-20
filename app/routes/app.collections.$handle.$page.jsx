import {
  useActionData,
  useNavigation,
  useSubmit,
  // Link,
  useLoaderData,
  useNavigate,
  redirect,
  useOutletContext,
  useLocation,
} from "@remix-run/react";
import { useMemo, useState } from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  Grid,
  Pagination,
  Button,
  BlockStack,
  Box,
  List,
  InlineStack,
  InlineGrid,
  MediaCard,
  Link,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
const NUM_OF_PRODUCT_DISPLAYED = 6;
//let CURRENT_CURSOR_POSITION = null;
export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  // console.log("url");
  // console.log(request);
  // console.log(admin);
  // var CURRENT_CURSOR_POSITION;
  // var rel;
  // if (params.page === "1" && url.searchParams.has("cursor") === false) {
  //   console.log("1");
  //   CURRENT_CURSOR_POSITION = null;
  //   return redirect(`/app/collections/${params.handle}/1?rel=next&cursor=null`);
  // } else if (params.page === "1" && url.searchParams.has("cursor") === true) {
  //   CURRENT_CURSOR_POSITION = null;
  //   rel = "next";
  // } else {
  //   CURRENT_CURSOR_POSITION = url.searchParams.get("cursor");
  //   rel = url.searchParams.get("rel");
  // }
  //console.log(CURRENT_CURSOR_POSITION);
  var CURRENT_CURSOR_POSITION = url.searchParams.get("cursor");
  var rel = url.searchParams.get("rel");
  const { productList, nextpageInfo } = await pageContent(
    params.handle,
    params.page,
    CURRENT_CURSOR_POSITION,
    rel,
    admin.graphql,
  );
  CURRENT_CURSOR_POSITION = nextpageInfo.endCursor;
  const pageNo = params.page;
  const collectionHandle = params.handle;
  const { productsCount } = await productCount(collectionHandle, admin.graphql);
  const nextpagecursor = nextpageInfo.endCursor;
  //console.log(productList);
  //console.log(CURRENT_CURSOR_POSITION);

  //console.log(CURRENT_CURSOR_POSITION);
  //console.log(productList);
  //console.log(collectionHandle);
  return { collectionHandle, productsCount, pageNo, productList, nextpageInfo };
}

// export async function action() {}

async function productCount(collectionHandle, graphql) {
  const productCountQuery = `query ($collectionhandle:String!){
      collectionByHandle(handle: $collectionhandle){
      productsCount{
        count
      }
    }
  }`;
  const productCountQueryVariables = {
    variables: {
      collectionhandle: collectionHandle,
    },
  };
  const response = await graphql(productCountQuery, productCountQueryVariables);
  const data = await response.json();
  //console.log(data);
  return { productsCount: data.data.collectionByHandle.productsCount.count };
}

async function pageContent(
  collectionhandle,
  pageNumber,
  cursorpos,
  rel,
  graphql,
) {
  //console.log(collectionhandle);

  // const collectionContentQuery = `query ($collectionhandle: String!, $numProducts: Int!, $cursorpos: String){
  //   collectionByHandle(handle: $collectionhandle){
  //   products(first: $numProducts,  after: $cursorpos){
  //   edges{
  //       node{
  //       id
  //       title
  //       handle
  //       createdAt
  //       images (first: 1){
  //           edges {
  //               node {
  //                 id
  //                 url
  //               }
  //           }
  //       }
  //       }
  //   }
  //   pageInfo {
  //       hasPreviousPage
  //       hasNextPage
  //       startCursor
  //       endCursor
  //       }
  //       }
  //   }
  //   }`;
  // const collectionContentQueryVariables = {
  //   variables: {
  //     collectionhandle: collectionhandle,
  //     numProducts: NUM_OF_PRODUCT_DISPLAYED,
  //     cursorpos: cursorpos,
  //   },
  // };
  var searchString;
  if (rel == "next") {
    searchString = `first: ${NUM_OF_PRODUCT_DISPLAYED}, after: ${cursorpos}`;
  } else {
    searchString = `last: ${NUM_OF_PRODUCT_DISPLAYED}, before: ${cursorpos}`;
  }
  //console.log(searchString);
  const collectionContentQuery = `query ($collectionhandle: String!){ 
    collectionByHandle(handle: $collectionhandle){
    products(${searchString}){  
    edges{
        node{
        id
        title
        handle
        createdAt
        onlineStorePreviewUrl
        onlineStoreUrl
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
  //console.log(collectionContentQuery);
  const collectionContentQueryVariables = {
    variables: {
      collectionhandle: collectionhandle,
      // numProducts: NUM_OF_PRODUCT_DISPLAYED,
      // cursorpos: cursorpos,
    },
  };

  const response = await graphql(
    collectionContentQuery,
    collectionContentQueryVariables,
  );
  //console.log(response);
  const data = await response.json();
  //console.log(data.data.collectionByHandle);
  const productList1 = data.data.collectionByHandle.products.edges.map(
    (product, idx, arr) => {
      //   if (
      //     idx < NUM_OF_PRODUCT_DISPLAYED * (pageNumber - 1) ||
      //     idx >=
      //       NUM_OF_PRODUCT_DISPLAYED * (pageNumber - 1) + NUM_OF_PRODUCT_DISPLAYED
      //   )
      //     return;
      return {
        id: product?.node?.id,
        title: product?.node?.title,
        handle: product?.node?.handle,
        createdAt: product?.node?.createdAt,
        image: product?.node?.images?.edges[0]?.node?.url,
        StorePreviewUrl: product?.node?.onlineStorePreviewUrl,
        StoreUrl: product?.node?.onlineStoreUrl,
      };
    },
  );
  //const cursorsPos = getCursors(data1);
  const nextpageInfo = data.data.collectionByHandle.products.pageInfo;
  //console.log(nextpageInfo);
  const productList = productList1.filter((item) => item !== undefined);
  //const productList = productList1;
  //console.log(productList);
  //console.log(nextpageInfo);
  return { productList, nextpageInfo };
  //return json(data);
}

export default function collectionhandlepage() {
  const { collectionHandle, productsCount, pageNo, productList, nextpageInfo } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLoaderData();
  // console.log(productList);
  // console.log(nextpageInfo);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tabstate, setTabstate, shop] = useOutletContext();
  //console.log(tabstate);
  // console.log("shopname");
  // console.log(shop);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation();
  //console.log(location.pathname + location.search);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pagination = useMemo(() => {
    const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
      nextpageInfo || {};

    return {
      previous: {
        // disabled: !hasPreviousPage || !startCursor,
        enabled: hasPreviousPage,
        // link: `/app/shopifydata/?rel=previous&cursor=${startCursor}`,
        link: `/app/collections/${collectionHandle}/${Number(pageNo) - 1}?rel=previous&cursor="${startCursor}"`,
        //locationpath: `/app/collections/${collectionHandle}/${Number(pageNo) - 1}`,
      },
      next: {
        //disabled: !hasNextPage || !endCursor,
        enabled: hasNextPage,
        // disabled: !hasNextPage,
        // link: `/app/shopifydata/?rel=next&cursor=${endCursor}`,
        link: `/app/collections/${collectionHandle}/${Number(pageNo) + 1}?rel=next&cursor="${endCursor}"`,
        //locationpath: `/app/collections/${collectionHandle}/${Number(pageNo) + 1}`,
      },
    };
  }, [nextpageInfo]);

  return (
    //   <Page>
    //   <Layout>
    //     {productList.map((product, index) => (
    //       <Layout.Section variant="oneThird" key={product.id}>
    //         <Grid>
    //           <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
    //             <Card>
    //               <BlockStack gap="300">
    //                 <Text as="h3" variant="headingMd">
    //                   {product?.id && product.id}
    //                 </Text>
    //                 <Text as="h3" variant="headingMd">
    //                   {product?.title && product.title}
    //                 </Text>

    //                 <img
    //                   alt=""
    //                   width="50%"
    //                   height="50%"
    //                   src={product?.image && product.image}
    //                 />
    //               </BlockStack>
    //             </Card>
    //           </Grid.Cell>
    //         </Grid>
    //       </Layout.Section>
    //     ))}
    //   </Layout>
    //   <div
    //     style={{
    //       maxWidth: "700px",
    //       margin: "auto",
    //       border: "1px solid var(--p-color-border)",
    //     }}
    //   >
    //     <Pagination
    //       onPrevious={() => {
    //         console.log("Previous");
    //         const locationstr =
    //           location.pathname + location.search.replace(/%22/g, '"');
    //         const tabs1 = tabstate.map((tab) => {
    //           if (tab.url1 === locationstr) {
    //             tab.url1 = pagination.previous.link;
    //             console.log("newlinkp");
    //           }
    //           return tab;
    //         });
    //         setTabstate(tabs1);
    //         navigate(pagination.previous.link);
    //       }}
    //       onNext={() => {
    //         console.log("Next1");
    //         //console.log(location.pathname);
    //         //console.log(location.search.replace(/%22/g, '"'));
    //         //console.log(location.pathname.toString + location.search.toString);
    //         // navigate("/app/products/2", { relative: "path" });
    //         const locationstr =
    //           location.pathname + location.search.replace(/%22/g, '"');
    //         const tabs1 = tabstate.map((tab) => {
    //           console.log("taburl");

    //           console.log(tab.url);
    //           console.log(locationstr);

    //           if (tab.url1 === locationstr) {
    //             tab.url1 = pagination.next.link;
    //             console.log("newlinkn");
    //           }
    //           return tab;
    //         });
    //         setTabstate(tabs1);

    //         navigate(pagination.next.link);
    //         console.log("Next2");
    //       }}
    //       previousURL={pagination.previous.link}
    //       hasPrevious={pagination.previous.enabled}
    //       nextURL={pagination.next.link}
    //       hasNext={pagination.next.enabled}
    //       // hasNext="true"
    //       type="table"
    //       label={
    //         pageNo * NUM_OF_PRODUCT_DISPLAYED -
    //         NUM_OF_PRODUCT_DISPLAYED +
    //         1 +
    //         "-" +
    //         (pageNo * NUM_OF_PRODUCT_DISPLAYED <= productsCount
    //           ? pageNo * NUM_OF_PRODUCT_DISPLAYED
    //           : productsCount) +
    //         " of" +
    //         productsCount
    //       }
    //     />
    //   </div>
    // </Page>
    <Page fullWidth>
      {/* <Layout>
        <Layout.Section> */}
      <InlineGrid gap="100" columns={3}>
        {/* <InlineStack> */}
        {productList.map((product, index) => (
          // <Grid>
          //   <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 6 }}>

          <Card key={product.id}>
            <BlockStack gap="300">
              <Text as="h3" variant="headingMd">
                {product?.id && product.id.slice(22)}
              </Text>
              <Link
                url={
                  "https://admin.shopify.com/store/" +
                  shop +
                  "/products/" +
                  product.id.slice(22)
                }
                target="_blank"
                monochrome
                removeUnderline
              >
                <Text as="h3" variant="headingMd">
                  {product?.title && product.title}
                </Text>
              </Link>
              {/* <Link to="https://admin.shopify.com/store/fitunions-test1/products/9164932088118">
                hello
              </Link> */}
              <Link url={product?.StorePreviewUrl} target="_blank">
                <img
                  alt={product?.title && product.title}
                  width="100%"
                  height="100%"
                  src={product?.image && product.image}
                />
              </Link>
            </BlockStack>
          </Card>
          // <MediaCard
          //   key={product.id}
          //   portrait
          //   title={product?.id && product.id}
          //   primaryAction={{
          //     content: "Learn more",
          //     onAction: () => {},
          //   }}
          //   description={product?.title && product.title}
          //   popoverActions={[
          //     {
          //       content: "Link",
          //       onAction: () => {
          //         navigate(
          //           "https://admin.shopify.com/store/fitunions-test1/products/9164932088118",
          //         );
          //       },
          //     },
          //   ]}
          // >
          //   <a
          //     href="https://admin.shopify.com/store/fitunions-test1/products/9164932088118"
          //     target="_blank"
          //   >
          //     <img
          //       alt=""
          //       width="100%"
          //       height="100%"
          //       style={{
          //         objectFit: "cover",
          //         objectPosition: "center",
          //       }}
          //       src={product?.image && product.image}
          //     />
          //   </a>
          //   <Link to="https://github.com">hello</Link>
          // </MediaCard>
          //   </Grid.Cell>
          // </Grid>
        ))}
      </InlineGrid>
      {/* </InlineStack> */}
      {/* </Layout.Section>
      </Layout> */}
      <div>
        <Pagination
          onPrevious={() => {
            console.log("Previous");
            const locationstr =
              location.pathname + location.search.replace(/%22/g, '"');
            const tabs1 = tabstate.map((tab) => {
              if (tab.url1 === locationstr) {
                tab.url1 = pagination.previous.link;
                console.log("newlinkp");
              }
              return tab;
            });
            setTabstate(tabs1);
            navigate(pagination.previous.link);
          }}
          onNext={() => {
            console.log("Next1");
            //console.log(location.pathname);
            //console.log(location.search.replace(/%22/g, '"'));
            //console.log(location.pathname.toString + location.search.toString);
            // navigate("/app/products/2", { relative: "path" });
            const locationstr =
              location.pathname + location.search.replace(/%22/g, '"');
            const tabs1 = tabstate.map((tab) => {
              console.log("taburl");

              console.log(tab.url);
              console.log(locationstr);

              if (tab.url1 === locationstr) {
                tab.url1 = pagination.next.link;
                console.log("newlinkn");
              }
              return tab;
            });
            setTabstate(tabs1);

            navigate(pagination.next.link);
            console.log("Next2");
          }}
          previousURL={pagination.previous.link}
          hasPrevious={pagination.previous.enabled}
          nextURL={pagination.next.link}
          hasNext={pagination.next.enabled}
          // hasNext="true"
          type="table"
          label={
            pageNo * NUM_OF_PRODUCT_DISPLAYED -
            NUM_OF_PRODUCT_DISPLAYED +
            1 +
            "-" +
            (pageNo * NUM_OF_PRODUCT_DISPLAYED <= productsCount
              ? pageNo * NUM_OF_PRODUCT_DISPLAYED
              : productsCount) +
            " of" +
            productsCount
          }
        />
      </div>
    </Page>
  );
}
