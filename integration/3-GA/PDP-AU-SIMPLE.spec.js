/// <reference types="cypress" />

/*
  尽量选择稳定的产品来进行测试，否则更换产品需要全面更新断言测试
*/

/*---------------------------断言结果---------------------------*/
let PageView_result = false;        // PV断言结果
let product_detail_res = false;     // product_detail断言结果
let dy_navi_res = false;            // dy_web_navi断言结果
let pdp_image_res = false;          // pdp_image断言结果
let wish_list_res = false;          // wish_list断言结果
let addto_cart_res = false;         // add_to_cart断言结果
let cart_PageView_res = false;      // cart PV断言结果
let remove_cart_res = false;        // remove_cart断言结果
let x_reviews_res = false;          // x_reviews断言结果
let reviews_dd_res = false;         // reviews_dropdown断言结果
let installment_expand_res = false; // installment_expand断言结果
let installment_close_res = false;  // installment_close断言结果
let details_expand_res = false;     // details_expand断言结果
let details_close_res = false;      // details_close断言结果
let pdp_property_res = false;       // pdp_property断言结果
let dimensions_expand_res = false;  // dimensions_expand断言结果
let dimensions_close_res = false;   // dimensions_close断言结果
let delivery_expand_res = false;    // delivery_expand断言结果
let delivery_close_res = false;     // delivery_close断言结果

/*---------------------------前置数据定义---------------------------*/
let product_sku;
let product_name;
let product_label;
let product_brand = "No Brand";
let product_category;
let product_dimension;
let product_detail_value;
let product_detail_label;
let product_pic_type;

describe("test PDP GTM", () => {

  /*---------------------------前置数据设置---------------------------*/
  before("product imformation prepared", () => {
    cy
      .request("GET", Cypress.env("AU_API") + "v2/" + Cypress.env("AU_SIM"))
      .then((response) => {
        product_sku = response.body.variants[0].sku;
        product_name = response.body.variants[0].name;
        product_label = product_sku + " | " + product_name;
        response.body.taxons.find((taxon) => {
          if (taxon.ancestors.includes("Collections")) {
            product_brand = taxon.name;
          }
        });
        response.body.product_properties.product_details.find((detail) => {
          if (detail.explanation) {
            product_detail_value = detail.value;
            product_detail_label = detail.presentation + " - " + detail.value;
          }
        });
        let product_pic_position = response.body.variants[0].images[0].position
        product_pic_type = response.body.variants[0].images[0].type
        response.body.variants[0].assets.find((a)=>{
          if(a.position < product_pic_position){
            product_pic_position = a.position
            product_pic_type = a.type
          }
        })
      })
    });

  /*---------------------------测试主体---------------------------*/
  it("test AU simple", () => {

    /*---------------------------------------------触发GTM---------------------------------------------*/
    cy.visit(Cypress.env("AU_HPG") + Cypress.env("AU_SIM"));
    cy.get("span.is-active").prev().find("a").then(($a)=>{
      product_category = $a.text()
    })
    cy.get("span.is-active").prev().prev().then(($a)=>{
      product_dimension = $a.text()
    })
    // 触发wish_list
    cy.get('svg[aria-label="Add to wishlist"]').click(); 
    // 触发add_to_cart
    cy.get('[data-selenium="add_to_cart"]').click(); 
    // 触发remove_cart
    cy.get('[data-selenium="cart-item-remove"]').click(); 
    // 关闭cart
    cy.get('svg[aria-label="arrow-stick-next"]').click(); 
    // 触发x_reviews，后续需要修改标签
    cy.get("a.rf7vq7__rating-count").click(); 
    //触发review_dropdown
    cy.get(".J5uZNJ__button-outer").contains("Recommended").click()
      .then(() => {
        cy.contains("Most Recent").click();     
      });
    // 触发installment_expand
    cy.get('[data-selenium="product-price"]').parent().find("img[alt='zip']").click(); 
    // 触发installment_close，后续需要修改标签
    cy.get('.close-button').click(); 
    // 触发details_expand
    cy.get("div").contains("Product Details").click(); 
    // 触发pdp_property，修改product需更新
    cy.get("span").contains(product_detail_value).find("svg").click(); 
    //关闭property弹窗，后续需要修改标签
    cy.get("div.ZPYEqa__explanationModal")
      .find('svg[aria-label="dismiss"]').click();    
    // 触发details_close  
    cy.get("div").contains("Product Details").click(); 
    // 触发dimensions_expand
    cy.get("div").contains("Product Dimensions").click(); 
    // 触发dimensions_close
    cy.get("div").contains("Product Dimensions").click(); 
    // 触发delivery_expand
    cy.get("div").contains("Delivery & Warranty").click(); 
    // 触发delivery_close
    cy.get("div").contains("Delivery & Warranty").click(); 

    /*---------------------------------------------断言状态---------------------------------------------*/
    cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        // 测试pageview
        if (
          dl.event === "pageview" &&
          dl.pageCat === "product-detail" &&
          dl.pageType === "product"
        ) {
          PageView_result = true;
        }
        //测试product_detail
        if (dl.event === "productDetail") {
          dl.ecommerce.detail.products.some((sku) => {
            if (
              sku.brand === product_brand &&
              sku.id === product_sku &&
              sku.name === product_name &&
              sku.category === product_category &&
              product_dimension.includes(sku.dimension1)
            ) {
              product_detail_res = true;
            }
          });
        }
        //测试DY_web_navi
        if (
          dl["eventDetails.category"] === "dy_event" &&
          dl["eventDetails.action"] === "Web Navi" 
          //dl["eventDetails.label"] === "B"
        ) {
          dy_navi_res = true;
        }
        //测试pdp_image
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.category"] === "pdp_image" &&
          dl["eventDetails.label"] === product_pic_type &&
          dl["eventDetails.sku_id"] === product_sku
        ) {
          pdp_image_res = true;
        }
        //测试wish_list
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.action"] === "Wish-list" &&
          dl["eventDetails.label"] === product_label
        ) {
          wish_list_res = true;
        }
        //测试add_to_cart
        if (dl.event === "addToCart") {
          dl.ecommerce.add.products.some((sku) => {
            if (sku.id === product_sku) {
              addto_cart_res = true;
            }
          });
        }
        //测试cart_PageView
        if (dl.event === "pageview" && dl.pageCat === "cart") {
          cart_PageView_res = true;
        }
        //测试remove_cart
        if (dl.event === "removeFromCart") {
          dl.ecommerce.remove.products.some((sku) => {
            if (sku.id === product_sku) {
              remove_cart_res = true;
            }
          });
        }
        //测试x_reviews
        if (
          dl["eventDetails.action"] === "x_reviews" &&
          dl["eventDetails.label"] === "click"
        ) {
          x_reviews_res = true;
        }
        //测试review_dropdown
        if (
          dl["eventDetails.action"] === "review_dropdown" &&
          dl["eventDetails.label"] === "Most Recent"
        ) {
          reviews_dd_res = true;
        }
        //测试PDP_property，修改product需更新
        if (
          dl["eventDetails.action"] === "product_property" &&
          dl["eventDetails.label"] === product_detail_label
        ) {
          pdp_property_res = true;
        }
        //测试PDP_installment
        if (
          dl["eventDetails.action"] === "bnpl" &&
          dl["eventDetails.label"] === "expand"
        ) {
          installment_expand_res = true;
        }
        if (
          dl["eventDetails.action"] === "bnpl" &&
          dl["eventDetails.label"] === "close"
        ) {
          installment_close_res = true;
        }
        //测试PDP_details_details
        if (
          dl["eventDetails.action"] === "details" &&
          dl["eventDetails.label"] === "expand"
        ) {
          details_expand_res = true;
        }
        if (
          dl["eventDetails.action"] === "details" &&
          dl["eventDetails.label"] === "close"
        ) {
          details_close_res = true;
        }
        //测试PDP_details_dimensions
        if (
          dl["eventDetails.action"] === "dimensions" &&
          dl["eventDetails.label"] === "expand"
        ) {
          dimensions_expand_res = true;
        }
        if (
          dl["eventDetails.action"] === "dimensions" &&
          dl["eventDetails.label"] === "close"
        ) {
          dimensions_close_res = true;
        }
        //测试PDP_details_delivey
        if (
          dl["eventDetails.action"] === "delivery" &&
          dl["eventDetails.label"] === "expand"
        ) {
          delivery_expand_res = true;
        }
        if (
          dl["eventDetails.action"] === "delivery" &&
          dl["eventDetails.label"] === "close"
        ) {
          delivery_close_res = true;
        }
      });
      
      /*---------------------------------------------断言判断---------------------------------------------*/
      expect(PageView_result, "is PDP has a pageview").to.equal(true);                  // 断言PageView
      expect(product_detail_res, "is PDP has a product_detail").to.equal(true);         // 断言product_detail
      expect(dy_navi_res, "is PDP has a DY web_navi").to.equal(true);                   // 断言DY_web_navi
      expect(pdp_image_res, "is PDP has a pdp_iamge").to.equal(true);                   // 断言pdp_image
      expect(wish_list_res, "is PDP has a wish_list").to.equal(true);                   // 断言wish_list
      expect(addto_cart_res, "is PDP has a add_to_cart").to.equal(true);                // 断言add_to_cart
      expect(cart_PageView_res, "is PDP has a cart_pageview").to.equal(true);           // 断言cart_PageView
      expect(remove_cart_res, "is PDP has a remove_cart").to.equal(true);               // 断言remove_cart
      expect(x_reviews_res, "is PDP has a x_reviews").to.equal(true);                   // 断言x_reviews
      expect(reviews_dd_res, "is PDP has a reviews_dropdown").to.equal(true);           // 断言reviews_dropdown
      expect(pdp_property_res, "is PDP has a pdp_property").to.equal(true);             // 断言pdp_property
      expect(installment_expand_res,"is PDP has a installment_expand").to.equal(true);  // 断言pdp_details
      expect(installment_close_res, "is PDP has a installment_close").to.equal(true);   // 断言pdp_details
      expect(details_expand_res, "is PDP has a details_expand").to.equal(true);         // 断言details_expand
      expect(details_close_res, "is PDP has a details_close").to.equal(true);           // 断言details_close
      expect(dimensions_expand_res, "is PDP has a dimensions_expand").to.equal(true);   // 断言dimensions_expand
      expect(dimensions_close_res, "is PDP has a dimensions_close").to.equal(true);     // 断言dimensions_close
      expect(delivery_expand_res, "is PDP has a delivery_expand").to.equal(true);       // 断言delivery_expand
      expect(delivery_close_res, "is PDP has a delivery_close").to.equal(true);         // 断言delivery_close
    });
  });
});
