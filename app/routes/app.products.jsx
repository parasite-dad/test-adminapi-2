//import { json, createRequestHandler, redirect } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useNavigation,
  useSubmit,
  Link,
  useLoaderData,
  useNavigate,
  Outlet,
} from "@remix-run/react";
import { useState, useCallback } from "react";
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
  Tabs,
} from "@shopify/polaris";
import { authenticate, sessionStorage } from "../shopify.server";
//import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

export async function loader({ request, params }) {
  //console.log(request);
  const { admin } = await authenticate.admin(request);

  console.log(admin);
  const session1 = await sessionStorage.findSessionsByShop(
    "fitunions-test1.myshopify.com",
  );
  console.log(session1);
  return json({ product: "product" });
}

export async function action({ request, params }) {
  return redirect("/app/products");
}

export default function appProducts() {
  //const { product } = useLoaderData();
  const product = "i love product1";
  console.log(product);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selected, setSelected] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: "all-customers-fitted-3",
      content: "All",
      badge: "10+",
      accessibilityLabel: "All customers",
      panelID: "all-customers-fitted-content-3",
    },
    {
      id: "accepts-marketing-fitted-3",
      content: "Accepts marketing",
      badge: "4",
      panelID: "accepts-marketing-fitted-content-3",
    },
  ];
  return (
    // <Page>
    //   <Grid>
    //     <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
    //       <Card>
    //         {/* <Button size="large" url="/app/products">
    //           Products
    //         </Button> */}
    //         <Link to="/app/products">products</Link>
    //       </Card>
    //     </Grid.Cell>
    //   </Grid>

    //   <Layout>
    //     <Layout.Section variant="oneThird">
    //       <Grid>
    //         <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
    //           <Card>
    //             <Text as="h3" variant="headingMd">
    //               {product}
    //             </Text>
    //           </Card>
    //         </Grid.Cell>
    //       </Grid>
    //     </Layout.Section>
    //   </Layout>
    // </Page>
    <Page>
      <Layout>
        <Card>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={() => {
              handleTabChange;
              navigate("/app/products/" + String(selected + 2));
            }}
            fitted
          ></Tabs>
        </Card>
        <Outlet />
      </Layout>
    </Page>
  );
}
