/// <reference types="cypress" />

let token = ''
describe('test SG pageview', ()=>{
    Cypress.on('window:before:load', (win)=>{
        // 在页面loading前，创建一个对象获取window.ga元素
        win.ga = cy.stub().as('ga')
    })
    
    before(()=>{
        // 监听GA
        cy.intercept({hostname: 'www.google-analytics.com'}, {statusCode: 503})  
        // 登录
        // cy.request('POST', Cypress.env('SG_API') + 'oauth/token', {grant_type: "password", password: "123456", username: "cypress@test.com",}).then((response)=>{
        //     token = response.body.access_token  // 保存token
        // })
        // 设置cookie并判断cookie是否设置成功
        cy.setCookie('select_country_hint_hidden', true)
        cy.getCookie('select_country_hint_hidden').should(
        'have.property',
        'value',
        true
        )
    })
    it('test SG HP', ()=>{
        cy.visit(Cypress.env('SG_HPG'))
        // cy.get('@ga').should('be.calledWith', 'create', 'UA-42655755-16')  // 通过GA ID来分辨是否为我们创建的
        // 测试pageview
        cy.window().then((win)=>{
            assert.isDefined(win.dataLayer, 'datalayer is defined')  // 看dataLayer是否被生成 
            const result = win.dataLayer.some((dl)=>{
                if(dl.event === 'pageview' && dl.pageCat === 'home'){
                    return true
                }
            })
            expect(result, 'is HP has a pageview').to.equal(true)  // 看pageview是否正确被触发
        })
    })

    it('test AU HP', ()=>{
        cy.visit(Cypress.env('AU_HPG'))
        // cy.get('@ga').should('be.calledWith', 'create', 'UA-42655755-16')  // 通过GA ID来分辨是否为我们创建的
        // 测试pageview
        cy.window().then((win)=>{
            assert.isDefined(win.dataLayer, 'datalayer is defined')  // 看dataLayer是否被生成 
            const result = win.dataLayer.some((dl)=>{
                if(dl.event === 'pageview' && dl.pageCat === 'home'){
                    return true
                }
            })
            expect(result, 'is HP has a pageview').to.equal(true)  // 看pageview是否正确被触发
        })
    })

    it('test US HP', ()=>{
        cy.visit(Cypress.env('US_HPG'))
        // cy.get('@ga').should('be.calledWith', 'create', 'UA-42655755-16')  // 通过GA ID来分辨是否为我们创建的
        // 测试pageview
        cy.window().then((win)=>{
            assert.isDefined(win.dataLayer, 'datalayer is defined')  // 看dataLayer是否被生成 
            const result = win.dataLayer.some((dl)=>{
                if(dl.event === 'pageview' && dl.pageCat === 'home'){
                    return true
                }
            })
            expect(result, 'is HP has a pageview').to.equal(true)  // 看pageview是否正确被触发
        })
    })
})