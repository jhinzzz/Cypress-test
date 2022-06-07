/// <reference types="cypress" />

let products = []
describe('PDP traversal', ()=> {
    products = require('../../fixtures/SG-slugs')
    //console.log(products)
    products.forEach((product)=>{ //遍历数组并动态创建测试任务
        it('view SG product : ' + product.slug,()=>{
            cy.request(Cypress.env('SG_PDP') + product.slug).then((response)=>{  //二次校验，防止出现请求正确页面加载失败的情况
                expect(response.body).to.include('add_to_cart')
            })
        })
    })
})