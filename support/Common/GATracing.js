
class GATracing {
    /**
     * 
     * @param {*} nation 国家
     * @param {*} pageType 页面类型
     * @param {*} url 目前为了兼容后缀，后续看是否要优化成只有一个类型网址
     */
    constructor(nation, pageType='') {
        this.nation = nation;
        this.pageType = pageType;
        this.apiURL = Cypress.env(nation + '_API');
        this.tax = {'AU': 1.1, 'SG':1.07, 'US': 1};
    }
    // 封装页面访问函数
    test_pageVisit() {
        return cy.visit({
            url: Cypress.env(this.nation + '_HPG') + Cypress.env(this.pageType),
            auth:{
                username: 'castlery',
                password: 'cslr$T@g'
            }
        });
    };
    /*--------------------- 封装断言函数 ---------------------*/
    // 封装pageview断言
    assertPageView() {
        return cy.window().then((win) =>{
            win.dataLayer.some((dl) =>{
                // 判断是否有pageview事件被触发
                this.isSendEvent(win, 'event', 'pageview')
                // 判断发送数据是否正确
                switch(this.pageType) {
                    case '_HPG': {
                        if (dl.event === 'pageview' && dl.pageCat === 'home'){
                            expect(dl.pageType, 'DLPL1 - HP page view').to.equal('home');
                            expect(dl.pageCountry, 'DLPL1 - HP page view').to.equal(this.nation);
                          };
                        break;
                    };
                    case '_CATEGORY': {
                        if (dl.event === 'pageview' && dl.pageCat === 'product-list'){
                            expect(dl.pageContent, 'DLPL1 - Category page view').to.equal('sofas');
                            expect(dl.pageCountry, 'DLPL1 - Category page view').to.equal(this.nation);
                        };
                        break;
                    };
                    case '_BLOG': {
                        if (dl.event === 'pageview' && dl.pageCat === 'blog'){
                            expect(dl.pageContent, 'DLPL1 - Blog page view').to.equal('blog');
                            expect(dl.pageCountry, 'DLPL1 - Blog page view').to.equal(this.nation);
                        };
                        break;
                    }
                    case '_TRADE': {
                        if (dl.event === 'pageview' && dl.pageCat === 'corporate'){
                            expect(dl.pageContent, 'DLPL1 - Trade page view').to.equal('corporate');
                            expect(dl.pageCountry, 'DLPL1 - Trade page view').to.equal(this.nation);
                        };
                        break;
                    }
                    default: {
                        throw 'Please input correct page type';
                    }
                }
            });
        });
    };
    // 封装productImpression断言
    assertProductImpression() {
        let variant;
        // 通过cy.fixture获取requestbody  
        cy.fixture('requestSearchBody').then((data)=>{
            // 通过_search接口获取第一个产品数据
            cy.request({
                method: 'POST',
                url: this.apiURL + '/search/product/_search',
                body: data
            })
            .then((Response) =>{
                // 获取response中的第一个variant
                variant = Response.body.hits.hits[0]._source.variants[0];
            })
        });
        // 断言
        cy.window().then((win) =>{
            // 判断是否有productImpression事件被触发
            this.isSendEvent(win, 'event', 'productImpression')
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                if (dl.event === 'productImpression') {
                    dl.ecommerce.impressions.some((sendVariant) =>{
                        expect(sendVariant.name, 'DLE1 - productImpression').to.equal(variant.name);
                        expect(sendVariant.id, 'DLE1 - productImpression').to.equal(variant.sku);
                        expect(sendVariant.price, 'DLE1 - productImpression').to.equal((variant.price / this.tax[this.nation]).toFixed(2));
                        // 匹配测试第一个成功后就跳出测试
                        return true;
                    })
                }
            })
        })
    }
    // 封装productClick断言
    assertProductClick() {
        let variant;
        // 通过cy.fixture获取requestbody  
        cy.fixture('requestSearchBody').then((data)=>{
            // 通过_search接口获取第一个产品数据
            cy.request({
                method: 'POST',
                url: this.apiURL + '/search/product/_search',
                body: data
            })
            .then((Response) =>{
                // 获取response中的第一个variant
                variant = Response.body.hits.hits[0]._source.variants[0];
            })
        });

        cy.window().then((win) =>{
            // 判断是否有productClick事件被触发
            this.isSendEvent(win, 'event', 'productClick')
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                if (dl.event === 'productClick') {
                    dl.ecommerce.click.products.some((sendVariant) =>{
                        expect(sendVariant.name, 'DLE3 - productClick').to.equal(variant.name);
                        expect(sendVariant.id, 'DLE3 - productClick').to.equal(variant.sku);
                        expect(sendVariant.price, 'DLE3 - productClick').to.equal((variant.price / this.tax[this.nation]).toFixed(2));
                        // 匹配测试第一个成功后就跳出测试
                        return true;
                    })
                }
            })
        })
    }

    // 封装SortFilter断言
    assertSoftFilter() {
        return cy.window().then((win) =>{
            // 判断是否有TrackEvent事件被触发
            this.isSendEvent(win, 'event', 'trackEvent');
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                if (dl['event'] === 'trackEvent') {
                    expect(dl['eventDetails.category'], 'DLE4 - Category filter').to.equal('Product Listings');
                    expect(dl['eventDetails.action'], 'DLE4 - Category filter').to.equal('Sort Filter');
                    expect(dl['eventDetails.label'], 'DLE4 - Category filter').to.equal('Price: High to Low');
                }
            })
        })
    }

    // 封装Checkout断言
    assertCheckout(step) {
        cy.window().then((win) => {
            // 判断是否有Checkout事件被触发
            this.isSendEvent(win, 'event', 'checkout');
            win.dataLayer.some((dl) => {
                
                if(dl['event'] === 'checkout'){
                    // 解构
                    const {ecommerce:{checkout:{actionField}} } = dl;
                    switch(step){
                        case '1': {
                            const productAPI = this.apiURL + '/v3' + Cypress.env(this.pageType);
                            cy.request({
                                url: productAPI,
                                method: 'GET'
                            })
                            .then((Response) => {
                                const rs = Response.body;
                                dl.ecommerce.checkout.products.some((product) => {
                                    expect(product.id, 'DLE11 - Checkout SKU').to.equal(rs.variants[0].sku);
                                    expect(product.name, 'DLE11 - Checkout Name').to.equal(rs.variants[0].name);
                                    expect(product.price, 'DLE11 - Checkout Price').to.equal((rs.variants[0].price / this.tax[this.nation]).toFixed(2));
                                })
                            })
                            break;
                        };
                        case '2': {
                            expect(actionField.step, 'DLE11 - Checkout step').to.equal(2);
                            break;
                        }
                        case '3': {
                            expect(actionField.step, 'DLE11 - Checkout step').to.equal(3);
                            break;
                        }
                        case '4': {
                            expect(actionField.step, 'DLE11 - Checkout step').to.equal(4);
                            break;
                        }
                        default: throw 'Please input correct checkout step.'
                    }
                }
            })
        })
    }

    // 封装search address断言
    assertSearchAddress() {
        return cy.window().then((win) =>{
            // 判断是否有TrackEvent事件被触发
            this.isSendEvent(win, 'event', 'trackEvent');
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                // 注意，不要在else加断言判断是否发送Event！
                if (dl['event'] === 'trackEvent' && dl['eventDetails.action'] === 'search_address') {
                    // 目前都是写死，后续需要优化。
                    expect(dl['eventDetails.category'], 'DLE26 - Search address').to.equal('checkout_shipping_address');
                    switch (this.nation) {
                        case 'AU': {
                            expect(dl['eventDetails.label'], 'DLE26 - Search address').to.equal('Sydney 2000');
                            break;
                        }
                        case 'SG': {
                            expect(dl['eventDetails.label'], 'DLE26 - Search address').to.equal('undefined 259841');
                            break;
                        }
                        case 'US': {
                            expect(dl['eventDetails.label'], 'DLE26 - Search address').to.equal('McLean 22102');
                            break;
                        }
                    }
                }
            })
        })
    }

    // 封装add address断言
    assertAddAddress() {
        return cy.window().then((win) =>{
            // 判断是否有TrackEvent事件被触发
            this.isSendEvent(win, 'event', 'trackEvent');
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                // 注意，不要在else加断言判断是否发送Event！
                if (dl['event'] === 'trackEvent' && dl['eventDetails.action'] === 'add_address') {
                    // 目前都是写死，后续需要优化。
                    expect(dl['eventDetails.category'], 'DLE26 - Add address').to.equal('checkout_shipping_address');
                    switch (this.nation) {
                        case 'AU': {
                            expect(dl['eventDetails.label'], 'DLE26 - Add address').to.equal('Sydney 2000');
                            break;
                        }
                        case 'SG': {
                            expect(dl['eventDetails.label'], 'DLE26 - Add address').to.equal('undefined 259841');
                            break;
                        }
                        case 'US': {
                            expect(dl['eventDetails.label'], 'DLE26 - Add address').to.equal('McLean 22102');
                            break;
                        }
                    }
                }
            })
        })
    }

    //封装Add coupon断言
    assertAddCoupon(code='cypresstest') {
        return cy.window().then((win) =>{
            // 判断是否有TrackEvent事件被触发
            this.isSendEvent(win, 'eventDetails.action', 'add_coupon');
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                if (dl['eventDetails.action'] === 'add_coupon') {
                    switch(dl['eventDetails.category']) {
                        case 'checkout_shipping_address': {
                            expect(dl['eventDetails.label'], 'DLE26 - Shipping address').to.equal(code);
                            break;
                        }
                        case 'checkout_shipping_method': {
                            expect(dl['eventDetails.label'], 'DLE27 - Shipping method').to.equal(code);
                            break;
                        }
                        case 'checkout_payment': {
                            expect(dl['eventDetails.label'], 'DLE28 - Payment').to.equal(code);
                            break;
                        }
                    }
                }
            })
        })
    }

    // 封装shipping method断言
    assertShippingMethod() {
        return cy.window().then((win) =>{
            // 判断是否有TrackEvent事件被触发
            this.isSendEvent(win, 'eventDetails.category', 'dy_event');
            // 判断发送数据是否正确
            win.dataLayer.some((dl) =>{
                // 注意，不要在else加断言判断是否发送Event！
                if (dl['event'] === 'trackEvent' && dl['eventDetails.category'] === 'dy_event') {
                    // 目前都是写死，后续需要优化。
                    expect(dl['eventDetails.action'], 'DLE22 - Shipping method').to.equal('Shipping Method');
                }
            })
        })
    }

    // 封装Split shipment断言
    assertSplitShipment() {
        return cy.window().then((win) =>{
            // 判断是否有Shipment Split事件被触发
            const result = this.isSendEvent(win, 'eventDetails.label', 'Single shipment only');
            expect(result, 'DLE27 - Shipment Split').to.equal(true);
            // 判断发送数据是否正确
            // win.dataLayer.some((dl) =>{
            //     // 注意，不要在else加断言判断是否发送Event！
            //     if (dl['event'] === 'trackEvent' && dl['eventDetails.action'] === 'shipping_preference') {
            //         // 目前都是写死，后续需要优化。
            //         expect(dl['eventDetails.label'], 'DLE27 - Shipment Split').to.equal('Single shipment only');
            //     }
            // })
        })
    }

    assertTransaction() {
        return cy.window().then((win) =>{
            // 判断是否有 Transaction 事件被触发
            const result = this.isSendEvent(win, 'event', 'transaction');
            expect(result, 'DLE13 - Transaction').to.equal(true);
            // win.data.some((dl) => {
            //     if (dl.event === 'transaction') {

            //     }
            // })
        })
    }

    // 封装GA事件触发断言
    isSendEvent(win, eventType, eventValue) {
        if (win.dataLayer.some(dl => dl[eventType] === eventValue)) {
            return true;
        }
        else {
            console.log(win.dataLayer.some(dl => dl[eventType] === eventValue));
            throw eventType + ': ' + eventValue + ' is not sent';
        }
        
    }
}

export default GATracing