class GATracing {
  /**
   *
   * @param {*} nation 国家
   * @param {*} pageType 页面类型
   * @param {*} url 目前为了兼容后缀，后续看是否要优化成只有一个类型网址
   */
  constructor(nation, pageType = "") {
    this.nation = nation;
    this.pageType = pageType;
    this.apiURL = Cypress.env(nation + "_API");
    this.tax = { AU: 1.1, SG: 1.07, US: 1 };
  }
  // 封装页面访问函数
  test_pageVisit() {
    return cy.visit({
      url: Cypress.env(this.nation + "_TEST") + Cypress.env(this.pageType),
      auth: {
        username: "castlery",
        password: "cslr$T@g",
      },
    });
  }
  /*--------------------- 封装断言函数 ---------------------*/
  // 封装pageview断言
  assertPageView() {
    return cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        // 判断是否有pageview事件被触发
        this.isSendEvent(win, "event", "pageview");
        // 判断发送数据是否正确
        switch (this.pageType) {
          case "_HPG": {
            if (dl.event === "pageview" && dl.pageCat === "home") {
              expect(dl.pageType, "DLPL1 - HP page view").to.equal("home");
              expect(dl.pageCountry, "DLPL1 - HP page view").to.equal(
                this.nation
              );
            }
            break;
          }
          case "_CATEGORY": {
            if (dl.event === "pageview" && dl.pageCat === "product-list") {
              expect(dl.pageContent, "DLPL1 - Category page view").to.equal(
                "sofas"
              );
              expect(dl.pageCountry, "DLPL1 - Category page view").to.equal(
                this.nation
              );
            }
            break;
          }
          case "_BLOG": {
            if (dl.event === "pageview" && dl.pageCat === "blog") {
              expect(dl.pageContent, "DLPL1 - Blog page view").to.equal("blog");
              expect(dl.pageCountry, "DLPL1 - Blog page view").to.equal(
                this.nation
              );
            }
            break;
          }
          case "_TRADE": {
            if (dl.event === "pageview" && dl.pageCat === "corporate") {
              expect(dl.pageContent, "DLPL1 - Trade page view").to.equal(
                "corporate"
              );
              expect(dl.pageCountry, "DLPL1 - Trade page view").to.equal(
                this.nation
              );
            }
            break;
          }
          case "_CON": {
            if (dl.event === "pageview" && dl.pageCat === "product-detail") {
              expect(
                dl.pageType,
                "DLPL1 - Product detail page view"
              ).to.have.string("product");
            }
            if (dl.event === "pageview" && dl.pageCat === "cart") {
              expect(dl.pageCat, "DLE10 - Cart page view").to.have.string(
                "cart"
              );
            }
            break;
          }
          case "_SIM": {
            if (dl.event === "pageview" && dl.pageCat === "product-detail") {
              expect(
                dl.pageType,
                "DLPL1 - Product detail page view"
              ).to.have.string("product");
            }
            if (dl.event === "pageview" && dl.pageCat === "cart") {
              expect(dl.pageCat, "DLE10 - Cart page view").to.have.string(
                "cart"
              );
            }
            break;
          }
          case "_BUN": {
            if (dl.event === "pageview" && dl.pageCat === "product-detail") {
              expect(
                dl.pageType,
                "DLPL1 - Product detail page view"
              ).to.have.string("product");
            }
            if (dl.event === "pageview" && dl.pageCat === "cart") {
              expect(dl.pageCat, "DLE10 - Cart page view").to.have.string(
                "cart"
              );
            }
            break;
          }
          default: {
            throw "Please input correct page type";
          }
        }
      });
    });
  }

  //测试PDP_detail
  assertPDPDetail(GA) {
    return cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        this.isSendEvent(win, "event", "productDetail");
        if (dl.event === "productDetail") {
          dl.ecommerce.detail.products.some((sku) => {
            expect(sku.brand, "DLE19 - PDP Details brand").to.equal(
              GA.productBrand
            );
            expect(sku.id, "DLE19 - PDP Details SKU").to.equal(GA.productSKU);
            expect(sku.name, "DLE19 - PDP Details name").to.equal(
              GA.productName
            );
            expect(sku.category, "DLE19 - PDP Details category").to.equal(
              GA.productCategory
            );
            // productDimension.includes(sku.dimension1)
          });
        }
      });
    });
  }

  // 封装测试PDPimage
  assertPDPImage(GA) {
    return cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        this.isSendEvent(win, "eventDetails.category", "pdp_image");
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.category"] === "pdp_image"
        ) {
          expect(
            dl["eventDetails.label"],
            "DLE18 - PDP image impression"
          ).to.equal(GA.productPictureType);
          // 无法解决无法获取数据的问题，暂时先注释。
          // expect(dl["eventDetails.sku_id", '3.Test PDP image']).to.equal(GA.productSKU)
        }
      });
    });
  }

  // 封装wishlist断言
  assertAddWishlist(GA) {
    return cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        this.isSendEvent(win, "eventDetails.action", "Wish-list");
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.action"] === "Wish-list"
        ) {
          expect(dl["eventDetails.label"], "DLE7 - add to wishlist").to.equal(
            GA.productLabel
          );
        }
      });
    })
  }

  // 封装ATC断言
  assertAddToCart(GA) {
    return cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        this.isSendEvent(win, "event", "addToCart");
        //测试add_to_cart
        if (dl.event === "addToCart") {
          dl.ecommerce.add.products.some((sku) => {
            expect(sku.id, "DLE8 - addToCart").to.equal(GA.productSKU);
          });
        }
      });
    });
  }

  // 测试cart_PageView
  assert;

  assertAddToCart(GA) {
    return cy.window().then((win) => {
      win.dataLayer.some((dl) => {});
    });
  }

  // 封装productImpression断言
  assertProductImpression() {
    let variant;
    // 通过cy.fixture获取requestbody
    cy.fixture("requestSearchBody").then((data) => {
      // 通过_search接口获取第一个产品数据
      cy.request({
        method: "POST",
        url: this.apiURL + "/search/product/_search",
        body: data,
      }).then((Response) => {
        // 获取response中的第一个variant
        variant = Response.body.hits.hits[0]._source.variants[0];
      });
    });
    // 断言
    cy.window().then((win) => {
      // 判断是否有productImpression事件被触发
      this.isSendEvent(win, "event", "productImpression");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        if (dl.event === "productImpression") {
          dl.ecommerce.impressions.some((sendVariant) => {
            expect(sendVariant.name, "DLE1 - productImpression").to.equal(
              variant.name
            );
            expect(sendVariant.id, "DLE1 - productImpression").to.equal(
              variant.sku
            );
            expect(sendVariant.price, "DLE1 - productImpression").to.equal(
              (variant.price / this.tax[this.nation]).toFixed(2)
            );
            // 匹配测试第一个成功后就跳出测试
            return true;
          });
        }
      });
    });
  }
  // 封装productClick断言
  assertProductClick() {
    let variant;
    // 通过cy.fixture获取requestbody
    cy.fixture("requestSearchBody").then((data) => {
      // 通过_search接口获取第一个产品数据
      cy.request({
        method: "POST",
        url: this.apiURL + "/search/product/_search",
        body: data,
      }).then((Response) => {
        // 获取response中的第一个variant
        variant = Response.body.hits.hits[0]._source.variants[0];
      });
    });

    cy.window().then((win) => {
      // 判断是否有productClick事件被触发
      this.isSendEvent(win, "event", "productClick");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        if (dl.event === "productClick") {
          dl.ecommerce.click.products.some((sendVariant) => {
            expect(sendVariant.name, "DLE3 - productClick").to.equal(
              variant.name
            );
            expect(sendVariant.id, "DLE3 - productClick").to.equal(variant.sku);
            expect(sendVariant.price, "DLE3 - productClick").to.equal(
              (variant.price / this.tax[this.nation]).toFixed(2)
            );
            // 匹配测试第一个成功后就跳出测试
            return true;
          });
        }
      });
    });
  }

  // 封装SortFilter断言
  assertSoftFilter() {
    return cy.window().then((win) => {
      // 判断是否有TrackEvent事件被触发
      this.isSendEvent(win, "event", "trackEvent");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        if (dl["event"] === "trackEvent") {
          expect(
            dl["eventDetails.category"],
            "DLE4 - Category filter"
          ).to.equal("Product Listings");
          expect(dl["eventDetails.action"], "DLE4 - Category filter").to.equal(
            "Sort Filter"
          );
          expect(dl["eventDetails.label"], "DLE4 - Category filter").to.equal(
            "Price: High to Low"
          );
        }
      });
    });
  }

  // 封装Checkout断言
  assertCheckout(step) {
    cy.window().then((win) => {
      // 判断是否有Checkout事件被触发
      this.isSendEvent(win, "event", "checkout");
      win.dataLayer.some((dl) => {
        if (dl["event"] === "checkout") {
          // 解构
          const {
            ecommerce: {
              checkout: { actionField },
            },
          } = dl;
          switch (step) {
            case "1": {
              const productAPI =
                this.apiURL + "/v3" + Cypress.env(this.pageType);
              cy.request({
                url: productAPI,
                method: "GET",
              }).then((Response) => {
                const rs = Response.body;
                dl.ecommerce.checkout.products.some((product) => {
                  expect(product.id, "DLE11 - Checkout SKU").to.equal(
                    rs.variants[0].sku
                  );
                  expect(product.name, "DLE11 - Checkout Name").to.equal(
                    rs.variants[0].name
                  );
                  expect(product.price, "DLE11 - Checkout Price").to.equal(
                    (rs.variants[0].price / this.tax[this.nation]).toFixed(2)
                  );
                });
              });
              break;
            }
            case "2": {
              expect(actionField.step, "DLE11 - Checkout step").to.equal(2);
              break;
            }
            case "3": {
              expect(actionField.step, "DLE11 - Checkout step").to.equal(3);
              break;
            }
            case "4": {
              expect(actionField.step, "DLE11 - Checkout step").to.equal(4);
              break;
            }
            default:
              throw "Please input correct checkout step.";
          }
        }
      });
    });
  }

  // 封装search address断言
  assertSearchAddress() {
    return cy.window().then((win) => {
      // 判断是否有TrackEvent事件被触发
      this.isSendEvent(win, "event", "trackEvent");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        // 注意，不要在else加断言判断是否发送Event！
        if (
          dl["event"] === "trackEvent" &&
          dl["eventDetails.action"] === "search_address"
        ) {
          // 目前都是写死，后续需要优化。
          expect(
            dl["eventDetails.category"],
            "DLE26 - Search address"
          ).to.equal("checkout_shipping_address");
          switch (this.nation) {
            case "AU": {
              expect(
                dl["eventDetails.label"],
                "DLE26 - Search address"
              ).to.equal("Sydney 2000");
              break;
            }
            case "SG": {
              expect(
                dl["eventDetails.label"],
                "DLE26 - Search address"
              ).to.equal("undefined 259841");
              break;
            }
            case "US": {
              expect(
                dl["eventDetails.label"],
                "DLE26 - Search address"
              ).to.equal("McLean 22102");
              break;
            }
          }
        }
      });
    });
  }

  // 封装add address断言
  assertAddAddress() {
    return cy.window().then((win) => {
      // 判断是否有TrackEvent事件被触发
      this.isSendEvent(win, "event", "trackEvent");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        // 注意，不要在else加断言判断是否发送Event！
        if (
          dl["event"] === "trackEvent" &&
          dl["eventDetails.action"] === "add_address"
        ) {
          // 目前都是写死，后续需要优化。
          expect(dl["eventDetails.category"], "DLE26 - Add address").to.equal(
            "checkout_shipping_address"
          );
          switch (this.nation) {
            case "AU": {
              expect(dl["eventDetails.label"], "DLE26 - Add address").to.equal(
                "Sydney 2000"
              );
              break;
            }
            case "SG": {
              expect(dl["eventDetails.label"], "DLE26 - Add address").to.equal(
                "undefined 259841"
              );
              break;
            }
            case "US": {
              expect(dl["eventDetails.label"], "DLE26 - Add address").to.equal(
                "McLean 22102"
              );
              break;
            }
          }
        }
      });
    });
  }

  //封装Add coupon断言
  assertAddCoupon(code = "cypresstest") {
    return cy.window().then((win) => {
      // 判断是否有TrackEvent事件被触发
      this.isSendEvent(win, "eventDetails.action", "add_coupon");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        if (dl["eventDetails.action"] === "add_coupon") {
          switch (dl["eventDetails.category"]) {
            case "checkout_shipping_address": {
              expect(
                dl["eventDetails.label"],
                "DLE26 - Shipping address"
              ).to.equal(code);
              break;
            }
            case "checkout_shipping_method": {
              expect(
                dl["eventDetails.label"],
                "DLE27 - Shipping method"
              ).to.equal(code);
              break;
            }
            case "checkout_payment": {
              expect(dl["eventDetails.label"], "DLE28 - Payment").to.equal(
                code
              );
              break;
            }
          }
        }
      });
    });
  }

  // 封装shipping method断言
  assertShippingMethod() {
    return cy.window().then((win) => {
      // 判断是否有TrackEvent事件被触发
      this.isSendEvent(win, "eventDetails.category", "dy_event");
      // 判断发送数据是否正确
      win.dataLayer.some((dl) => {
        // 注意，不要在else加断言判断是否发送Event！
        if (
          dl["event"] === "trackEvent" &&
          dl["eventDetails.category"] === "dy_event"
        ) {
          // 目前都是写死，后续需要优化。
          expect(dl["eventDetails.action"], "DLE22 - Shipping method").to.equal(
            "Shipping Method"
          );
        }
      });
    });
  }

  // 封装Split shipment断言
  assertSplitShipment() {
    return cy.window().then((win) => {
      // 判断是否有Shipment Split事件被触发
      const result = this.isSendEvent(
        win,
        "eventDetails.label",
        "Single shipment only"
      );
      expect(result, "DLE27 - Shipment Split").to.equal(true);
      // 判断发送数据是否正确
      // win.dataLayer.some((dl) =>{
      //     // 注意，不要在else加断言判断是否发送Event！
      //     if (dl['event'] === 'trackEvent' && dl['eventDetails.action'] === 'shipping_preference') {
      //         // 目前都是写死，后续需要优化。
      //         expect(dl['eventDetails.label'], 'DLE27 - Shipment Split').to.equal('Single shipment only');
      //     }
      // })
    });
  }

  assertTransaction() {
    return cy.window().then((win) => {
      // 判断是否有 Transaction 事件被触发
      const result = this.isSendEvent(win, "event", "transaction");
      expect(result, "DLE13 - Transaction").to.equal(true);
      // win.data.some((dl) => {
      //     if (dl.event === 'transaction') {

      //     }
      // })
    });
  }

  // 封装GA事件触发断言
  isSendEvent(win, eventType, eventValue) {
    if (win.dataLayer.some((dl) => dl[eventType] === eventValue)) {
      return true;
    } else {
      console.log(win.dataLayer.some((dl) => dl[eventType] === eventValue));
      throw eventType + ": " + eventValue + " is not sent";
    }
  }

  assertPDP() {
    cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        // 测试pageview
        if (dl.event === "pageview" && dl.pageCat === "product-detail") {
          expect(
            dl.pageType,
            "DLPL1 - Product detail page view"
          ).to.have.string("product");
        }
        //测试product_detail
        if (dl.event === "productDetail") {
          dl.ecommerce.detail.products.some((sku) => {
            expect(sku.brand, "DLE19 - PDP Details brand").to.equal(
              GA.productBrand
            );
            expect(sku.id, "DLE19 - PDP Details SKU").to.equal(GA.productSKU);
            expect(sku.name, "DLE19 - PDP Details name").to.equal(
              GA.productName
            );
            expect(sku.category, "DLE19 - PDP Details category").to.equal(
              GA.productCategory
            );
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
          expect(dl["eventDetails.label"], "3.Test PDP image").to.equal(
            GA.productPictureType
          );
          // 无法解决无法获取数据的问题，暂时先注释。
          // expect(dl["eventDetails.sku_id", '3.Test PDP image']).to.equal(GA.productSKU)
        }
        //测试wish_list
        if (
          dl.event === "trackEvent" &&
          dl["eventDetails.action"] === "Wish-list"
        ) {
          expect(dl["eventDetails.label"], "4.Test wishlist").to.equal(
            GA.productLabel
          );
        }
        //测试add_to_cart
        if (dl.event === "addToCart") {
          dl.ecommerce.add.products.some((sku) => {
            expect(sku.id, "5. Test ATC").to.equal(GA.productSKU);
          });
        }
        //测试cart_PageView
        if (dl.event === "pageview" && dl.pageCat === "cart") {
          expect(dl.pageCat, "6. Test cart page view").to.have.string("cart");
        }
        //测试remove_cart
        if (dl.event === "removeFromCart") {
          dl.ecommerce.remove.products.some((sku) => {
            expect(sku.id, "7. Test remove cart").to.equal(GA.productSKU);
            // if (sku.id === GA.productSKU) {
            //   GA.removeCartResult = true;
            // }
          });
        }
        //测试x_reviews
        if (dl["eventDetails.action"] === "x_reviews") {
          expect(dl["eventDetails.label"], "10. Test x reviews click").to.equal(
            "click"
          );
          //GA.xReviewsResult = true;
        }
        //测试review_dropdown
        if (dl["eventDetails.action"] === "review_dropdown") {
          expect(
            dl["eventDetails.label"],
            "11. Test most recent reviews"
          ).to.equal("Most Recent");
          // GA.reviewsDrowdownResult = true;
        }
        //测试PDP_property
        if (dl["eventDetails.action"] === "product_property") {
          expect(
            dl["eventDetails.label"],
            "12. Test product property"
          ).to.equal(GA.productDetailLabel);
          //GA.pdpPropertyResult = true;
        }
        //测试installment
        if (
          dl["eventDetails.action"] === "bnpl" &&
          dl["eventDetails.label"] === "expand"
        ) {
          expect(dl["eventDetails.sku_id"], "13. Test detail expand").to.equal(
            GA.productSKU
          );
        }
        if (
          dl["eventDetails.action"] === "bnpl" &&
          dl["eventDetails.label"] === "close"
        ) {
          expect(dl["eventDetails.sku_id"], "14. Test detail expand").to.equal(
            GA.productSKU
          );
        }
        //测试PDP_details_details
        if (
          dl["eventDetails.action"] === "details" &&
          dl["eventDetails.label"] === "expand"
        ) {
          expect(dl["eventDetails.sku_id"], "15. Test detail expand").to.equal(
            GA.productSKU
          );
          // GA.detailsExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "details" &&
          dl["eventDetails.label"] === "close"
        ) {
          expect(dl["eventDetails.sku_id"], "16. Test detail expand").to.equal(
            GA.productSKU
          );
          // GA.detailsExpandResult = true;
        }
        //测试PDP_details_dimensions
        if (
          dl["eventDetails.action"] === "dimensions" &&
          dl["eventDetails.label"] === "expand"
        ) {
          expect(
            dl["eventDetails.sku_id"],
            "17. Test dimensions expand"
          ).to.equal(GA.productSKU);
          // GA.dimensionsExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "dimensions" &&
          dl["eventDetails.label"] === "close"
        ) {
          expect(
            dl["eventDetails.sku_id"],
            "18. Test dimensions expand"
          ).to.equal(GA.productSKU);
          // GA.dimensionsCloseResult = true;
        }
        //测试PDP_details_delivey
        if (
          dl["eventDetails.action"] === "delivery" &&
          dl["eventDetails.label"] === "close"
        ) {
          expect(
            dl["eventDetails.sku_id"],
            "19. Test delivery expand"
          ).to.equal(GA.productSKU);
          // GA.deliveryExpandResult = true;
        }
        if (
          dl["eventDetails.action"] === "delivery" &&
          dl["eventDetails.label"] === "close"
        ) {
          expect(
            dl["eventDetails.sku_id"],
            "20. Test delivery expand"
          ).to.equal(GA.productSKU);
          // GA.deliveryCloseResult = true;
        }
      });
    });
  }
}

export default GATracing;
