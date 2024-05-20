// import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  Outlet,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
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
      //url: collection?.node?.image?.url,
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
  //const urlarray = new Array(collectionList.length);
  // const [url, setUrl] = useState(urlarray);
  // console.log("url");
  // console.log(url);
  const shop = useOutletContext();
  const [imageurl, setImageurl] = useState(1);
  //const [] = useState(0);
  const navigate = useNavigate();
  //const navigation = useNavigation();
  const location = useLocation();
  //console.log("location");
  //console.log(location.pathname);

  const tabs1 = collectionList.map((collection, idx) => ({
    id: collection.id,
    content: collection.title,
    //imagesrc: collection?.url ? collection?.url : null,
    handle: collection.handle,
    //handle: "fitness-apparel",
    //url: null,
    //cannot use url in polaris tab, it is reserved word.
    url1: "/app/collections/" + collection.handle + "/1?rel=next&cursor=null",
  }));
  //console.log(tabs1);
  const [tabstate, setTabstate] = useState(tabs1);
  console.log("tabstate");
  console.log(tabstate);
  //console.log(tabs1);
  //console.log(tabstate);
  // const n1 = () => {
  //   console.log("null1");
  //   setTabstate(() => {
  //     tabstate[selected].url =
  //       "/app/collections/" + tabstate[selected].handle + "/1";
  //     //return tabstate;
  //   });
  //   navigate("/app/collections/" + tabstate[selected].handle + "/1");
  // };
  // const n2 = () => {
  //   console.log("null2");
  //   navigate(tabstate[selected].url);
  // };
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    console.log("selectedtabindex");
    console.log(selectedTabIndex);
    //tabs[selectedTabIndex].url = location.pathname;
    //console.log(tabs1[selectedTabIndex].url);
    //setImageurl(tabs1[selectedTabIndex].url);
    //setImageurl(tabs1[selected].url);
    // setUrl(url[selectedTabIndex]  );
    //console.log(tabstate[selectedTabIndex].url);
    //tabstate[selectedTabIndex].url === null ? n1 : n2;
    // const updatetabs = tabs1.map((tabs, idx) => {
    //   if (idx === selectedTabIndex) {
    //     console.log(tabs);
    //     console.log(idx);
    //     if (tabs.url === null) {
    //       console.log(tabs);
    //       tabs.url = "/app/collections/" + tabs.handle + "/1";
    //       //return tabs;
    //     }
    //     // else {
    //     //  tabs.url = location.pathname;
    //     //return tabs;
    //     //}
    //   }
    //   console.log(tabs);
    //   return tabs;
    // });
    //setTabstate(updatetabs);
    navigate(tabstate[selectedTabIndex].url1);
    console.log(tabstate[selectedTabIndex].url1);
    // if (tabstate[selectedTabIndex].url === null) {
    //   navigate(
    //     "/app/collections/" +
    //       tabstate[selectedTabIndex].handle +
    //       "/1?rel=next&cursor=null",
    //   );
    // } else {
    //   navigate(tabstate[selectedTabIndex].url);
    // }
    // if (tabstate[selectedTabIndex].url === null) {
    //   console.log(tabstate[selectedTabIndex].url);
    //   setTabstate(() => {
    //     tabstate[selectedTabIndex].url =
    //       "/app/collections/" + tabstate[selectedTabIndex].handle + "/1";
    //     //return tabstate;
    //   });

    //   navigate("/app/collections/" + tabstate[selectedTabIndex].handle + "/1");
    // } else {
    //   console.log(tabstate[selectedTabIndex].url);
    //   navigate(tabstate[selectedTabIndex].url);
    // }

    //console.log(navigation.location);
    // setTabstate(() => {
    //   tabstate[selectedTabIndex].url = location.pathname;
    //   console.log("tabstate");
    //   console.log(tabstate);
    //   return tabstate;
    // });
  }, []);
  // console.log("location");
  // console.log(location.pathname);
  // console.log(selected);
  // if (tabstate[selected].url === null) {
  //   console.log(tabstate[selected].url);
  //   setTabstate(() => {
  //     tabstate[selected].url =
  //       "/app/collections/" + tabstate[selected].handle + "/1";
  //     //return tabstate;
  //   });
  //   navigate("/app/collections/" + tabstate[selected].handle + "/1");
  // } else {
  //   console.log(tabstate[selected].url);
  //   navigate(tabstate[selected].url);
  // }
  // setTabstate(() => {
  //   tabstate[selected].url = location.pathname;
  //   console.log("tabstate");
  //   console.log(tabstate);
  //   return tabstate;
  // });
  //console.log(location.pathname);
  // setTabstate(() => {
  //   tabstate[selected].url = location.pathname;
  // });
  // navigate(
  //   "/app/collections/" + collectionList[selectedTabIndex].handle + "/1",
  // );
  // tabs[selectedTabIndex].url === null
  //   ? navigate("/app/collections/" + tabs[selectedTabIndex].handle + "/1")
  //   : navigate(tabs[selectedTabIndex].url);
  // tabstate[selectedTabIndex].url === null
  //   ? navigate("/app/collections/" + tabstate[selectedTabIndex].handle + "/1")
  //   : navigate(tabstate[selectedTabIndex].url);

  //console.log(location.pathname);

  //setUrl({...url, tabs1[selected].handle: location.pathname});
  // console.log("selected1");
  // console.log(selected);
  return (
    <Page>
      <Layout>
        <Card>
          <Tabs
            tabs={tabs1}
            selected={selected}
            onSelect={handleTabChange}
            fitted
          >
            {/* <img
              alt=""
              width="50%"
              height="50%"
              src={imageurl && imageurl}
              // onClick={() => navigate("/app/products/1")}
            ></img> */}
            <Outlet context={[tabstate, setTabstate, shop]} />
          </Tabs>
        </Card>
      </Layout>
    </Page>
  );
}
