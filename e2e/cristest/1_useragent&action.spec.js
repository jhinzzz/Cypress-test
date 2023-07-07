/// <reference types="cypress" />

describe.skip('Test SG category', ()=>{

    before('setcookie',()=>{
        // 设置cookie并判断cookie是否设置成功
        cy.setCookie('select_country_hint_hidden', 'true')
        cy.getCookie('select_country_hint_hidden').should('have.property','value', 'true')
    })
    it('test living-room', ()=>{
        cy.visit('https://www.castlery.com/sg/?&dyApiPreview=64279e3c7151aa8f796aad476b6a5c08')
     //   cy.get('a[data-label="Shop The Look"]').contains('Shop The Look').click()  // 触发link_click
        cy.get('a[data-label="Living Room Sets"]').contains('Living Room').click({force:true})  // 触发link_click
        cy.get('div.text').contains('Clearance').click({force:true})  // 触发category_filter
        cy.get('a').contains('Recommendation').click({force:true})  //触发Recommendation下拉框
        cy.get('a').contains('Fast Dispatch').click({force:true})  // 触发sort_filter
        cy.get('a').contains('Price: Low to High').click({force:true})
    }) 
})


describe('test bot user-agent',()=>{
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'",
    "Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6",
    "Opera/9.80 (Windows NT 5.1; U; zh-cn) Presto/2.9.168 Version/11.50",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; zh-cn)",
    "Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122/534.30",
    "google/Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36",
    "bing/Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534+ (KHTML, like Gecko) BingPreview/1.0b",
    "bing/Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "baidu/Mozilla/5.0(iPhone;CPUiPhoneOS9_1likeMacOSX)AppleWebKit/601.1.46(KHTML,likeGecko)Version/9.0Mobile/13B143Safari/601.1(compatible;Baiduspider-render/2.0;+http://www.baidu.com/search/spider.html)",
    "pinterest/Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Pinterest/28.1.0 Chrome/106.0.5249.199 Electron/21.3.3 Safari/537.36",
    "yahoo/Mozilla/5.0 (compatible; Yahoo! Slurp;http://help.yahoo.com/help/us/ysearch/slurp)",
    "360/Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gcko) Chrome/50.0.2661.102 Safari/537.36; 360Spider",
    "apple/Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1)",
    "byte/Mozilla/5.0 (compatible; Bytespider;[https://zhanzhang.toutiao.com/] AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.0.0 Safari/537.36",
    "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
    ].forEach((info) => {
    it("test"+info,()=>{
        cy.visit(`https://www-test.castlery.com/sg/products/nathan-velvet-sofa-bed`, {
            onBeforeLoad: win => {
                 Object.defineProperty(win.navigator, 'userAgent', {
                  //   value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
                     value: info,
                                 });
                             },
             headers: {
             authorization: 'Basic Y2FzdGxlcnk6Y3NsciRUQGc='
         },
                         });
    })
})

})

    

