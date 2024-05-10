import { json } from "@remix-run/node";
import {
  useActionData,
  useNavigation,
  useSubmit,
  Link,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
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
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
  //console.log(request);
  const { admin } = await authenticate.admin(request);
  //console.log(admin);
  return json({ product: "product" });
}

// export async function action({ request, params }) {
//   return redirect("/app/products");
// }

export default function test1() {
  //const { product } = useLoaderData();
  const product = "i love product test1";
  //console.log(product);
  // const navigate = useNavigate();
  return (
    <Page>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
          <Card>
            {/* <Button size="large" url="/app/products">
                Products
              </Button> */}
            <Link to="/app/products">products</Link>
          </Card>
        </Grid.Cell>
      </Grid>

      <Layout>
        <Layout.Section variant="oneThird">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 6 }}>
              <Card>
                <Text as="h3" variant="headingMd">
                  {product}
                </Text>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
