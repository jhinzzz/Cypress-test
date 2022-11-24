/// <reference types="cypress" />

import Cookie from '../../support/Common/setCookie';
import GATracing from '../../support/Common/GATracing';
import LoginOperation from '../../support/Operation/LoginOperation';
import ProductDetailOperation from '../../support/Operation/ProductDetailOperation';
import AddressOperation from '../../support/Operation/AddressOperation';
import ShippingMethodOperation from '../../support/Operation/ShippingMethodOperation';
import PaymentOperation from '../../support/Operation/PaymentOperation';
import AddressBookOperation from '../../support/Operation/AddressBookOperation';

describe('Test checkoutFlow', () =>{
    // 通过环境变量拿到国家数组
    const nation = Cypress.env('NATION');
    let pageType;

    // Cypress不支持在单个测试文件中进行跨域测试，所以只能暂时关闭捕获异常
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    // beforeEach('Set cookie', ()=>{

    // });
    for(let i=0; i < nation.length; i++) {
        describe(nation[i], () => {
            // 每次测试开始前，同步登录态
            beforeEach(() => {
                const GA = new GATracing(nation[i], '_LOGIN');
                const login = new LoginOperation();
                // 在开始前隐藏国家选取框
                cy.hideCountryHint();

                // session相当于保存本次登录的浏览器设置（cookie/ÍD等）
                // 但是同一个sessionID只会运行和保存一次，‘user’为ID标识
                cy.session(nation[i] + ' user', ()=>{
                    GA.test_pageVisit().then(() =>{
                        login.login();
                    });
                })
                // 解决US会重置shipment的问题
                if (nation[i] == 'US') {
                    cy.clearCookie('city').then(() => {
                        cy.setCookie('city', '{"city":"Mclean","zipcode":"22102","state":"VA"}');
                    });
                    
                }
            })
            // 添加购物车
            it( nation[i] + ' Add product to cart', () =>{
                pageType = nation[i] + '_SIM';
                const GA = new GATracing(nation[i], pageType);
                const pdp = new ProductDetailOperation(nation[i], pageType);
                GA.test_pageVisit().then(()=>{
                    pdp.checkoutFlow();
                })
            })

            // 测试Address page
            it(nation[i] + ' Test Address page', () =>{
                pageType = '_ADDRESS';
                const GA = new GATracing(nation[i], pageType);
                const address = new AddressOperation(nation[i]);
    
                GA.test_pageVisit().then(()=>{
                    address.createAddress();
                    address.testCoupon();
                    address.assertAddress();
                    address.nextStep();
                })
            })
    
            // 测试Shipping Method page
            it(nation[i] + ' Test Shipping Method page', () =>{
                pageType = '_METHOD';
                const GA = new GATracing(nation[i], pageType);
                const method = new ShippingMethodOperation(nation[i]);
    
                GA.test_pageVisit().then(()=>{
                    method.testCoupon();
                    method.assertMethod();
                    method.nextStep();
                })
            })
    
            // 测试Payment & Success page
            it(nation[i] + ' Test Payment page', () =>{
                pageType = '_PAYMENT';
                const GA = new GATracing(nation[i], pageType);
                const payment = new PaymentOperation(nation[i]);
    
                GA.test_pageVisit().then(()=>{
                    payment.chooseCard().then(() => {
                        payment.testCoupon();
                        // payment.nextStep();
                        payment.assertPayment();
                    });
                })
            })
            
            // 结尾
            it(nation[i] + ' Delete address & cart', () => {
                pageType = '_ADDRESSBOOK';
                const GA = new GATracing(nation[i], pageType);
                const book = new AddressBookOperation(nation[i], pageType);

                GA.test_pageVisit().then(() => {
                    book.deleteAddress();
                    book.RemoveCart();
                })
            })
        })
    }

    // describe(nation[1] + ' Test checkout', () => {
    //     // 每次测试开始前，同步登录态
    //     beforeEach(() => {
    //         const GA = new GATracing(nation[1], '_LOGIN');
    //         const login = new LoginPage();
    //         // session相当于保存本次登录的浏览器设置（cookie/ÍD等）
    //         // 但是同一个sessionID只会运行和保存一次，‘user’为ID标识
    //         cy.session(nation[1] + ' user', ()=>{
    //             GA.test_pageVisit().then(() =>{
    //                 login.inputEmail();
    //                 login.inputPassword();
    //                 login.clickLogin();
    //                 cy.wait(3000);
    //                 login.isSuccess();
    //             });
    //             // cy.getCookie('access_token').should('exist');
    //         })
    //     })
    //     // 添加购物车
    //     it( nation[1] + ' Add product to cart', () =>{
    //         pageType = nation[1] + '_SIM';
    //         const GA = new GATracing(nation[1], pageType);
    //         const pdp = new ProductDetailPage();
    //         GA.test_pageVisit().then(()=>{
    //             // 前端在页面加载完之前没有禁用ATC按钮，只能强制等待
    //             pdp.getATC().click();
    //             pdp.getCheckout().click();
    //         })
    //     })
    //     // 测试Address page
    //     it(nation[1] + ' Test Address', () =>{
    //         pageType = '_ADDRESS'
    //         const GA = new GATracing(nation[1], pageType);
    //         const address = new AddressOperation(nation[1]);
    //         // const category = new CategoryPage();
    //         GA.test_pageVisit().then(()=>{
    //             address.createAddress();
    //             address.nextStep();
    //         })
    //     })
    // })
    // describe(nation[2] + 'Test checkout', () => {
    //     // 每次测试开始前，同步登录态
    //     beforeEach(() => {
    //         const GA = new GATracing(nation[2], '_LOGIN');
    //         const login = new LoginPage();
    //         // session相当于保存本次登录的浏览器设置（cookie/ÍD等）
    //         // 但是同一个sessionID只会运行和保存一次，‘user’为ID标识
    //         cy.session(nation[2] + ' user', ()=>{
    //             GA.test_pageVisit().then(() =>{
    //                 login.inputEmail();
    //                 login.inputPassword();
    //                 login.clickLogin();
    //                 cy.wait(3000);
    //                 login.isSuccess();
    //             });
    //             // cy.getCookie('access_token').should('exist');
    //         })
    //     })
    //     // 添加购物车
    //     it( nation[2] + ' Add product to cart', () =>{
    //         pageType = nation[2] + '_SIM';
    //         const GA = new GATracing(nation[2], pageType);
    //         const pdp = new ProductDetailPage();
    //         GA.test_pageVisit().then(()=>{
    //             // 前端在页面加载完之前没有禁用ATC按钮，只能强制等待
    //             pdp.getATC().click();
    //             pdp.getCheckout().click();
    //         })
    //     })
    //     // 测试Address page
    //     it(nation[2] + ' Test Address', () =>{
    //         pageType = '_ADDRESS'
    //         const GA = new GATracing(nation[2], pageType);
    //         const address = new AddressOperation(nation[2]);
    //         // const category = new CategoryPage();
    //         GA.test_pageVisit().then(()=>{
    //             address.createAddress();
    //             address.nextStep();
    //         })
    //     })
    // })
})