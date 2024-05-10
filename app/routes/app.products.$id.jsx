/* eslint-disable react-hooks/rules-of-hooks */
//import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useNavigation,
  useSubmit,
  Link,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
//import { useState } from "React";
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
} from "@shopify/polaris";
import { useMemo } from "react";
//import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
//import { convertTypeAcquisitionFromJson } from "typescript";

const NUM_OF_PRODUCT_DISPLAYED = 6;
const currentcursor =
  "eyJsYXN0X2lkIjo5MTY0Nzk1NDc4MzI2LCJsYXN0X3ZhbHVlIjoiOTE2NDc5NTQ3ODMyNiJ9";
export async function loader({ request, params }) {
  console.log("test");
  const { admin, session } = await authenticate.admin(request);
  const { productList, nextpageInfo } = await pageContent(
    params.id,
    admin.graphql,
  );
  const pageNo = params.id;
  const { productsCount } = await productCount(admin.graphql);
  const nextpagecursor = nextpageInfo.endCursor;
  //  if (params.id === "new") {
  //   return json({
  //     destination: "product",
  //     title: "",
  //   });
  // }

  // return json(await getQRCode(Number(params.id), admin.graphql));
  // const [currentCursor, setcurrentCursor] = useState(currentcursor);
  // const [nextpageCursor, setnextpageCursor] = useState(nextpagecursor);
  // const [pagesNumber, setpagesNumber] = useState(1);
  return { productsCount, pageNo, productList, nextpageInfo };
}

export async function action(request, params) {
  // const { admin } = await authenticate.admin(request);
  // console.log("action");
  // return redirect(`/app/products/pages/${params.Id}`);
}

export default function productspage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  //const nav = useNavigation();
  //const actionData = useActionData();
  //const loaderData = useLoaderData();
  const { productsCount, pageNo, productList, nextpageInfo } = useLoaderData();
  // const submit = useSubmit();
  // const shopify = useAppBridge();
  // const isLoading =
  //   ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const pagination = useMemo(() => {
    const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
      nextpageInfo || {};

    return {
      previous: {
        disabled: !hasPreviousPage || !startCursor,
        // link: `/app/shopifydata/?rel=previous&cursor=${startCursor}`,
        link: `/app/products/${Number(pageNo) - 1}`,
      },
      next: {
        disabled: !hasNextPage || !endCursor,
        // link: `/app/shopifydata/?rel=next&cursor=${endCursor}`,
        link: `/app/products/${Number(pageNo) + 1}`,
      },
    };
  }, [nextpageInfo]);
  // const productId = actionData?.product?.id.replace(
  //   "gid://shopify/Product/",
  //   "",
  // );
  const navigate = useNavigate();
  return (
    <Page>
      {/* <TitleBar title="abc">
        <button
          variant="primary"
          onClick={() =>
            navigate("https://admin.shopify.com/store/fitunions-test1/products")
          }
        >

          Product App
        </button>
      </TitleBar> */}

      <Layout>
        {productList.map((product, index) => (
          <Layout.Section variant="oneThird" key={product.id}>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
                <Card>
                  <Text as="h3" variant="headingMd">
                    {product?.id && product.id}
                  </Text>
                  <Text as="h3" variant="headingMd">
                    {product?.title && product.title}
                  </Text>

                  <img
                    alt=""
                    width="50%"
                    height="50%"
                    src={product?.image && product.image}
                  />
                </Card>
              </Grid.Cell>
            </Grid>
          </Layout.Section>
        ))}
      </Layout>
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          border: "1px solid var(--p-color-border)",
        }}
      >
        <Pagination
          onPrevious={() => {
            console.log("Previous");
            navigate(pagination.previous.link);
          }}
          onNext={() => {
            console.log("Next1");
            // navigate("/app/products/2", { relative: "path" });
            navigate(pagination.next.link);
            console.log("Next2");
          }}
          previousURL={pagination.previous.link}
          hasPrevious={pagination.previous.disabled}
          nextURL={pagination.next.link}
          hasNext={pagination.next.disabled}
          type="page"
          label={
            pageNo * NUM_OF_PRODUCT_DISPLAYED -
            NUM_OF_PRODUCT_DISPLAYED +
            1 +
            "-" +
            pageNo * NUM_OF_PRODUCT_DISPLAYED +
            " of" +
            productsCount
          }
        />
      </div>
    </Page>
  );
}
async function productCount(graphql) {
  const productCountQuery = `query {
    productsCount{
      count
    }
  }`;
  const response = await graphql(productCountQuery);
  const data = await response.json();
  console.log(data);
  return { productsCount: data.data.productsCount.count };
}
async function pageContent(pageNumber, graphql) {
  const pageQuery = `query ($numProducts: Int!, $cursorpos: String){ 
  products(first: $numProducts, after: $cursorpos){
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
  }`;
  const pageQueryVariables = {
    variables: {
      numProducts: 250,
      cursorpos: null,
    },
  };
  console.log("query");
  const response = await graphql(pageQuery, pageQueryVariables);
  //console.log(response);
  const data = await response.json();
  console.log(data);
  const productList1 = data.data.products.edges.map((product, idx, arr) => {
    if (
      idx < NUM_OF_PRODUCT_DISPLAYED * (pageNumber - 1) ||
      idx >=
        NUM_OF_PRODUCT_DISPLAYED * (pageNumber - 1) + NUM_OF_PRODUCT_DISPLAYED
    )
      return;
    return {
      id: product?.node?.id,
      title: product?.node?.title,
      handle: product?.node?.handle,
      createdAt: product?.node?.createdAt,
      image: product?.node?.images?.edges[0]?.node?.url,
    };
  });
  //const cursorsPos = getCursors(data1);
  const nextpageInfo = data.data.products.pageInfo;
  //console.log(nextpageInfo);
  const productList = productList1.filter((item) => item !== undefined);
  //console.log(productList);
  return { productList, nextpageInfo };
}
