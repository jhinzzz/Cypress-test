/// <reference types="cypress" />

describe('Test SG category', ()=>{

    before('setcookie',()=>{
        // 设置cookie并判断cookie是否设置成功
        cy.setCookie('select_country_hint_hidden', 'true')
        cy.getCookie('select_country_hint_hidden').should('have.property','value', 'true')
    })
    it.only('test catgory', ()=>{
        cy.visit('https://www.castlery.com/sg/?&dyApiPreview=64279e3c7151aa8f796aad476b6a5c08')
     //   cy.get('a[data-label="Shop The Look"]').contains('Shop The Look').click()  // 触发link_click
        cy.get('a[data-label="Living Room Sets"]').contains('Living Room').click({force:true})  // 触发link_click
        cy.get('div.text').contains('Clearance').click({force:true})  // 触发category_filter
        cy.get('a').contains('Recommendation').click({force:true})  //触发Recommendation下拉框
        cy.get('a').contains('Fast Dispatch').click({force:true})  // 触发sort_filter
        cy.get('a').contains('Price: Low to High').click({force:true})
    }) 
    
    it('test catgory', ()=>{
        cy.window().then((win)=>{
            //  测试link_click
            const link_click_res = win.dataLayer.some((dl)=>{
                if(dl.event === 'trackEvent' && dl['eventDetails.label'] === 'Sofas'){  
                    return true
                }
            })
            expect(link_click_res, 'is category has a link_click').to.equal(true)  // 断言linck_click

            // 测试pageview
            const PageView_result = win.dataLayer.some((dl)=>{
                if(dl.event === 'pageview' && dl.pageCat === 'product-list'){  
                    return true
                }
            })
            expect(PageView_result, 'is category has a pageview').to.equal(true)  // 断言pageview

            // 测试category_filter
            const category_filter_res = win.dataLayer.some((dl)=>{
                if(dl.event === 'trackEvent' && dl['eventDetails.action'] === 'Category Filter'){  
                    return true
                }
            })
            expect(category_filter_res, 'is category has a category_filter').to.equal(true)  // 断言category_filter

            // 测试sort_filter
            const sort_filter_res = win.dataLayer.some((dl)=>{
                if(dl.event === 'trackEvent' && dl['eventDetails.action'] === 'Sort Filter'){  
                    return true
                }
            })
            expect(sort_filter_res, 'is category has a sort_filter').to.equal(true)  // 断言sort_filter
        })
    })
})