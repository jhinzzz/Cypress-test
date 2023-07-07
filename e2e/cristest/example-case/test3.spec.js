//Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15

/// <reference types="cypress" />

describe('test bot user-agent',()=>{
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15"
    ].forEach((info) => {
    it("test"+info,()=>{
        cy.visit(`https://www.castlery.com/sg`, {
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

    

