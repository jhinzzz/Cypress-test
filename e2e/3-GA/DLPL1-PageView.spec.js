/// <reference types="cypress" />
import Cookie from '../../support/Common/setCookie'
import GATracing from '../../support/Common/GATracing'

let token = ''
describe('Test DLPL1 - pageView', ()=>{
    Cypress.on('window:before:load', (win)=>{
        // 在页面loading前，创建一个对象获取window.ga元素
        win.ga = cy.stub().as('ga')
    })
    // Cypress不支持在单个测试文件中进行跨域测试，所以只能暂时关闭捕获异常
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })
    
    beforeEach('Set cookie', ()=>{
        cy.allure().epic('Test DLPL1 - pageView');
        // 监听GA
        cy.intercept({hostname: 'www.google-analytics.com'}, {statusCode: 503})  
        // 登录
        // cy.request('POST', Cypress.env('SG_API') + 'oauth/token', {grant_type: "password", password: "123456", username: "cypress@test.com",}).then((response)=>{
        //     token = response.body.access_token  // 保存token
        // })
        // 设置cookie并判断cookie是否设置成功
        cy.hideCountryHint();
    })

    // 定义测试的国家
    const nation = Cypress.env('NATION');
    // 定义测试的page
    const pageType = ['_HPG', '_CATEGORY', '_BLOG', '_TRADE']
    // 循环测试不同国家的page view
    for (let n = 0; n < nation.length; n++) {
        for (let p = 0; p < pageType.length; p++) {
            it('Test ' + nation[n] + '' + pageType[p], () =>{
            cy.allure().story(nation[n] + pageType[n]);

            const GA = new GATracing(nation[n], pageType[p]);

            GA.test_pageVisit();
            GA.assertPageView();
            });
        }
    }
})