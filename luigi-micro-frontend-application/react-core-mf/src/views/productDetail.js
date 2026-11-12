import React, { useEffect, useState, useRef } from 'react';
import "../../node_modules/fundamental-styles/dist/fundamental-styles.css";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import {
    Grid, ObjectPage, Label, ObjectPageHeader, ObjectPageTitle, ObjectStatus, FlexBox, Button, Toast, ObjectPageSection, FormItem, Form, Text, Bar, Toolbar
} from "@ui5/webcomponents-react";
import { linkManager, getContext } from "@luigi-project/client";
import { ProductCollection } from "../assets/products.js";

const ProductDetail = (props) => {
    const [currentProduct, setCurrentProduct] = useState({});
    const [availability, setAvailability] = useState({
        state: "Critical",
        text: props.localeDict.OUTOFSTOCK
    });
    const toast = useRef(null);

    useEffect(() => {
        setProductAndAvailability();
    }, []);

    function setProductAndAvailability() {
        // get id from Luigi Client getContext API
        const id = getContext().id;

        let product = ProductCollection.find(
            (product) => product.id.toString() === id
        ) || ProductCollection[0]

        setCurrentProduct(product);
        setAvailability({
            state: product.stock ? "Positive" : "Critical",
            text: product.stock ? props.localeDict.AVAILABLE : props.localeDict.OUTOFSTOCK
        });
    }

    // Use Luigi Client linkManager API to navigate to the previous microfrontend
    function navBack() {
        // checks if there is a previous view in history
        if (linkManager().hasBack()) {
            // navigates to the previously openend microfrontend
            linkManager().goBack();
        } else {
            // navigates to the products page directly
            linkManager().navigate("/home/products");
        }
    };

    return (
        <Grid position="Center" defaultIndent="XL1 L1 M1 S1" defaultSpan="XL10 L10 M10 S10">
            <ObjectPage
                headerArea={
                    <ObjectPageHeader>
                        <FlexBox alignItems="Center" wrap="Wrap">
                            <FlexBox direction="Column" style={{ padding: "10px" }}>
                                <Label>
                                    {props.localeDict.AVAILABLEQUANT + currentProduct.stock}
                                </Label>
                            </FlexBox>
                        </FlexBox>
                    </ObjectPageHeader>
                }
                footerArea={
                    <Bar design="FloatingFooter"
                        endContent={
                            <>
                                <Button design="Emphasized" onClick={() => { toast.current.open = true }}>
                                    {props.localeDict.ADDTOCART}
                                </Button>
                                <Button design="Default" onClick={navBack}>
                                    {props.localeDict.BACK}
                                </Button>
                            </>
                        }
                    />
                }
                titleArea={
                    <ObjectPageTitle
                        actionsBar={
                            <Toolbar>
                                <Button design="Emphasized" onClick={() => { toast.current.open = true }}>
                                    {props.localeDict.ADDTOCART}
                                </Button>
                                <Button onClick={navBack}>
                                    {props.localeDict.BACK}
                                </Button>
                            </Toolbar>
                        }
                        header={currentProduct.name}
                    >
                        <ObjectStatus state={availability.state}>
                            {availability.text}
                        </ObjectStatus>
                    </ObjectPageTitle>
                }
                onSelectedSectionChange={function noRefCheck() { }}
                selectedSectionId="details"
                style={{
                    height: "700px",
                }}
            >
                <ObjectPageSection aria-label="Details" id="details" titleText="Details">
                    <Form layout="S1 M2 L2 XL3" labelSpan="S12 M1 L1 XL1">
                        <FormItem labelContent={<Label>Name</Label>}>
                            <Text>{currentProduct.name}</Text>
                        </FormItem>
                        <FormItem labelContent={<Label>{props.localeDict.DESCRIPTION}</Label>}>
                            <Text>{currentProduct.description}</Text>
                        </FormItem>
                        <FormItem labelContent={<Label>{props.localeDict.PRICE}</Label>}>
                            <Text>
                                {currentProduct.price + " " + currentProduct.currencyCode}
                            </Text>
                        </FormItem>
                    </Form>
                </ObjectPageSection>
            </ObjectPage>
            <Toast ref={toast}>
                {props.localeDict.PRODUCTADDED}
            </Toast>
        </Grid>
    );
};

export default ProductDetail;
