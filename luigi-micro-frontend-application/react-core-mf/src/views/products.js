import React, { useEffect, useState } from 'react';
import "../../node_modules/fundamental-styles/dist/fundamental-styles.css";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { Grid, List, ListItemStandard } from "@ui5/webcomponents-react";
import { linkManager } from "@luigi-project/client";
import { ProductCollection } from "../assets/products.js";

const Products = (props) => {
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const tempList = [];
    ProductCollection.forEach((product) => {
      tempList.push(
        <ListItemStandard
          id={product.id}
          key={product.id}
          additionalText={product.price + " " + product.currencyCode}
          additionalTextState="Information"
          description={product.description}
          icon={product.icon}
          type="Active"
          text={product.name}
        />
      );
      setListItems(tempList);
    });
  }, [])

  // navigates to productDetail microfrontend through Luigi Client linkManager Api
  function handleItemClick(event) {
    linkManager().withParams({ root: "products" });
    linkManager().navigate(
      "/home/products/" + event.detail.item.id.toString()
    );
  };

  return (
    <Grid position="Center" defaultIndent="XL1 L1 M1 S1" defaultSpan="XL10 L10 M10 S10">
      <List headerText={props.localeDict.ITEMS + ": " + ProductCollection.length} onItemClick={handleItemClick}>
        {listItems}
      </List>
    </Grid>
  );
};

export default Products;
