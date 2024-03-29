/// <reference types="cypress" />

import Cookie from '../../support/Common/setCookie';
import GATracing from '../../support/Common/GATracing';
import CategoryPage from '../../support/PageObject/CategoryPage';

describe('Test DLE3 - productClick', () =>{
    // Cypress不支持在单个测试文件中进行跨域测试，所以只能暂时关闭捕获异常
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    beforeEach('Set cookie', ()=>{
        // 在开始前隐藏国家选取框
        cy.hideCountryHint();
    });

    // 定义测试的国家和网页
    const nation = Cypress.env('NATION');
    const pageType = '_CATEGORY'
    // 循环测试不同国家的productClick
    for (let n = 0; n < nation.length; n++) {
        it('Test ' + nation[n] + ' productClick', () =>{
            const GA = new GATracing(nation[n], pageType);
            const category = new CategoryPage();

            GA.test_pageVisit();
            category.getFirstProduct().click()
            GA.assertProductClick();
        })
    }
})