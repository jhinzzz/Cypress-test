/// <reference types="cypress" />

/*
  尽量选择稳定的产品来进行测试，否则更换产品需要全面更新断言测试
*/
import ProductDetailPage from '../../support/PageObject/ProductDetailPage';
import Cookie from '../../support/Common/setCookie'

/*---------------------------前置数据定义---------------------------*/
let GA

describe("Test PDP GTM", () => {
  /*---------------------------前置数据设置---------------------------*/
  before("product imformation prepared", () => {
    // 设置cookie并判断cookie是否设置成功
    const cookie = new Cookie();
    cookie.hideCountry();
    cookie.isHideCountry();
    //通过fixture获取数据
    cy.fixture('GA_data').then(function (data){
      GA = data;
    });

    cy
      .request("GET", Cypress.env("US_API") + "/v3" + Cypress.env("US_CON"))
      .then((response) => {
        //获取产品信息
        GA.productSKU = response.body.variants[0].sku;  //修改configurable后需要修改
        GA.productName = response.body.variants[0].name;  //修改configurable后需要修改
        GA.productLabel = GA.productSKU + " | " + GA.productName;
        GA.productMaterial = response.body.variants[0].variant_option_values[0].presentation;
        GA.productMaterialName = response.body.variants[0].variant_option_values[0].option_type_name;
        //
        response.body.taxons.find((taxon) => {
          if (taxon.ancestors.includes("Collections")) 
          {
            GA.productBrand = taxon.name;
          }
          //获取产品的category
          if (taxon.level == 2)
          {
            GA.productCategory = taxon.name
          }
        });
        //获取产品细节信息
        response.body.product_properties.product_details.find((detail) => {
          if (detail.explanation) 
          {
            GA.productDetailValue = detail.value;
            GA.productDetailLabel = detail.presentation + " - " + detail.value;
          }
        });
        // 获取产品图片信息
        GA.productPictureType = response.body.variants[0].images[0].type
      })
    });
  /*---------------------------测试主体---------------------------*/
  it("Test US configurable", () => {
    const PDP = new ProductDetailPage();
    cy.visit(Cypress.env("US_HPG") + Cypress.env("US_CON")).then(() =>{
      /*---------------------------------------------触发GTM---------------------------------------------*/
      // GA.productDimension = PDP.getDimension();
      // 触发PDP_image
      PDP.getImage().click();
      // 触发wish_list
      PDP.getWishList().click();
      // 触发add_to_cart
      PDP.getATC().click(); 
      // 触发remove_cart
      PDP.getRemove().click();
      // 关闭cart
      PDP.getCloseCart().click();
      // 触发swatch
      PDP.addSwatch();
      PDP.getSwatchText().then(($text) =>{
        GA.swatch_text = $text.text()
      })
      PDP.closeSwatch()
      // 触发material change
      PDP.clickMaterials();
      // 触发x_reviews，后续需要修改标签
      PDP.clickXReviews();
      // 触发review_dropdown
      PDP.clickMostRecent()
      // 切换至第一个material
      PDP.clickFirstMaterial();
      /**
       * Cypress对于iframe的支持太差，目前无法解决问题
      // 触发installment_expand
      PDP.getInstallmentExpand('us').click({multiple:true});
      // 触发installment_close，后续需要修改标签
      PDP.getInstallmentClose('us');
      */

      // 触发details_expand
      PDP.getDetail().click().then(()=>{
        // 触发pdp_property 
        PDP.getPropertyExpand(GA.productDetailValue).click();
        //关闭property弹窗，后续需要修改标签
        PDP.getPropertyClose().click();
        // 触发details_close  
        PDP.getDetail().click();
      });
      // 触发dimensions_expand
      PDP.getDimensions().click();
      // 触发dimensions_close
      PDP.getDimensions().click();
      // 触发delivery_expand
      PDP.getDelivery().click();
      // 触发delivery_close
      PDP.getDelivery().click();
    });
  });
    /*---------------------------------------------断言状态---------------------------------------------*/
  it('Assert US configurable', ()=>{
    /*---------------------------------------------断言状态---------------------------------------------*/
    cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        // 测试pageview
        if (
          dl.event === "pageview" &&
          dl.pageCat === "product-detail"
        ) {
          expect(dl.pageType, '1. Test page Type').to.have.string("product")
        }
        //测试product_detail
        if (dl.event === "productDetail") {
          dl.ecommerce.detail.products.some((sku) => {
            expect(sku.brand, '2. Test product detail brand').to.equal(GA.productBrand)
            expect(sku.id, '2. Test product detail SKU').to.equal(GA.productSKU)
            expect(sku.name, '2. Test product detail name').to.equal(GA.productName)
            expect(sku.category, '2. Test product detail category').to.equal(GA.productCategory)
            // productDimension.includes(sku.dimension1)
          });
        }
        //测试DY_web_navi
        // if (
        //   dl["eventDetails.category"] === "dy_event" &&
        //   dl["eventDetails.action"] === "Web Navi" 
        //   //dl["eventDetails.label"] === "B"
        // ) {
        //   GA.dyNaviResult = true;
        // }
        //测试pdp_image
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.category"] === "pdp_image"
          ) {
            expect(dl["eventDetails.label"], '3.Test PDP image').to.equal(GA.productPictureType)
            // 无法解决无法获取数据的问题，暂时先注释。
            // expect(dl["eventDetails.sku_id", '3.Test PDP image']).to.equal(GA.productSKU)
        }
        //测试wish_list
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.action"] === "Wish-list"
        ) {
          expect(dl["eventDetails.label"], '4.Test wishlist').to.equal(GA.productLabel)
        }
        //测试add_to_cart
        if (dl.event === "addToCart") {
          dl.ecommerce.add.products.some((sku) => {
            expect(sku.id, '5. Test ATC').to.equal(GA.productSKU)
          });
        }
        //测试cart_PageView
        if (dl.event === "pageview" && dl.pageCat === "cart") {
          expect(dl.pageCat, '6. Test cart page view').to.have.string('cart')
        }
        //测试remove_cart
        if (dl.event === "removeFromCart") {
          dl.ecommerce.remove.products.some((sku) => {
            expect(sku.id, "7. Test remove cart").to.equal(GA.productSKU)
            // if (sku.id === GA.productSKU) {
            //   GA.removeCartResult = true;
            // }
          });
        }
        //测试swatch_cart,修改product需更新
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.action"] === "Swatch - add to cart"
        ) {
          expect(dl["eventDetails.label"], '8. Test add swatch').to.have.string(GA.swatch_text)
          //dl["eventDetails.label"].includes(GA.swatch_text)
        }
        //测试material_change
        if (
          dl["eventDetails.category"] === 'eventDetails.category'
        ) {
          expect(dl["eventDetails.action"], '9. Test switch material').to.equal(GA.productMaterialName)
          expect(dl["eventDetails.label"], '9. Test switch material').to.equal(GA.productMaterial)
          expect(dl["eventDetails.sku_id"], '9. Test switch material').to.equal(GA.productSKU)
          // dl["eventDetails.action"] === GA.productMaterialName &&
          // dl["eventDetails.label"] === GA.productMaterial &&
          // dl["eventDetails.sku_id"] === GA.productSKU
          // GA.materialResult = true;
        }
        //测试x_reviews
        if (
          dl["eventDetails.action"] === "x_reviews"
        ) {
          expect(dl["eventDetails.label"], '10. Test x reviews click').to.equal("click")
          //GA.xReviewsResult = true;
        }
        //测试review_dropdown
        if (dl["eventDetails.action"] === "review_dropdown") {
          expect(dl["eventDetails.label"], '11. Test most recent reviews').to.equal("Most Recent")
          // GA.reviewsDrowdownResult = true;
        }
        //测试PDP_property
        if (dl["eventDetails.action"] === "product_property") 
        {
          expect(dl["eventDetails.label"], '12. Test product property').to.equal(GA.productDetailLabel)
          //GA.pdpPropertyResult = true;
        }
        /**
         * US暂时无法测试PDP_installment
        if (
          dl["eventDetails.action"] === "bnpl" &&
          dl["eventDetails.label"] === "expand"
        ) {
          GA.installmentExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "bnpl" &&
          dl["eventDetails.label"] === "close"
        ) {
          GA.installmentCloseResult = true;
        }
        **/
        //测试PDP_details_details
        if (
          dl["eventDetails.action"] === "details" &&
          dl["eventDetails.label"] === 'expand') {
          expect(dl["eventDetails.sku_id"], '13. Test detail expand').to.equal(GA.productSKU);
          // GA.detailsExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "details" &&
          dl["eventDetails.label"] === 'close') {
          expect(dl["eventDetails.sku_id"], '14. Test detail expand').to.equal(GA.productSKU);
          // GA.detailsExpandResult = true;
        }
        //测试PDP_details_dimensions
        if (
          dl["eventDetails.action"] === "dimensions" &&
          dl["eventDetails.label"] === 'expand') {
          expect(dl["eventDetails.sku_id"], '15. Test dimensions expand').to.equal(GA.productSKU);
          // GA.dimensionsExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "dimensions" &&
          dl["eventDetails.label"] === 'close') {
          expect(dl["eventDetails.sku_id"], '16. Test dimensions expand').to.equal(GA.productSKU);
          // GA.dimensionsCloseResult = true;
        }
        //测试PDP_details_delivey
        if (
          dl["eventDetails.action"] === "delivery" &&
          dl["eventDetails.label"] === 'close') {
            expect(dl["eventDetails.sku_id"], '17. Test delivery expand').to.equal(GA.productSKU);
            // GA.deliveryExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "delivery" &&
          dl["eventDetails.label"] === 'close') {
            expect(dl["eventDetails.sku_id"], '18. Test delivery expand').to.equal(GA.productSKU);
            // GA.deliveryCloseResult = true;
        }
      })
    })
  })
})
