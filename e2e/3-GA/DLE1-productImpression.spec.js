/// <reference types="cypress" />
import Cookie from '../../support/Common/setCookie';
import GATracing from '../../support/Common/GATracing';

describe('Test product impression', () =>{
    // Cypress不支持在单个测试文件中进行跨域测试，所以只能暂时关闭捕获异常
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    before(()=>{
        // 在开始前隐藏国家选取框
        const cookie = new Cookie();
        cookie.hideCountry();
        cookie.isHideCountry();
    });

    // 定义测试的国家和网页
    const nation = ['AU', 'SG', 'US'];
    const pageType = '_CATEGORY'
    // 循环测试不同国家的productImpression
    for (let n = 0; n < nation.length; n++) {
        it('Test ' + nation[n] + ' productImpression', () =>{
            const GA = new GATracing(nation[n], pageType);

            GA.test_pageVisit().then(()=>{
                // 向下滚动以保证product会出现
                cy.scrollTo(0,100);
                GA.assertProductImpression()
            });
        })
    }
})