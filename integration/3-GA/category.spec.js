/// <reference types="cypress" />

describe('test SG category', ()=>{

    it('test catgory', ()=>{
        //cy.visit('https://www.castlery.com/sg/?&dyApiPreview=64279e3c7151aa8f796aad476b6a5c08')

        cy.get('.QP9WMA__mainLinks > :nth-child(1) > [data-label="Living Room"]').click()  // 触发link_click
        cy.get('.sk-panel__content > :nth-child(1) > :nth-child(1)').contains('All Living Room').click({force:true})  // 触发category_filter
        cy.get('.oKSUwO__select > .qL97UN').contains('Recommendation').click()
        cy.get('.oKSUwO__select > .qL97UN > .qL97UN__options > :nth-child(2) > div').click()  // 触发sort_filter

        cy.window().then((win)=>{
            //  测试link_click
            const link_click_res = win.dataLayer.some((dl)=>{
                if(dl.event === 'trackEvent' && dl['eventDetails.label'] === 'Living Room'){  
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