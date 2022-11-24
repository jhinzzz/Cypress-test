
class GARequest{
    constructor(nation='AU'){
        if (nation == 'AU') {
            this.url = Cypress.env('AU_API');
        }
        else if (nation == 'SG') {
            this.url = Cypress.env('AU_API');
        }
        else if (nation == 'US') {
            this.url = Cypress.env('AU_API');
        }
        else {
            throw 'Please input country';
        }
        // this.requestName = requestName;
    }
    login() {
        return cy.fixture('Account').then((data) => { 
                cy.request({
                    method: 'POST',
                    url: this.url + '/oauth/token',
                    body: {
                        grant_type: "password",
                        username: data.Account,
                        password: data.Password
                    }
                }).then((Response) =>{
                    cy.setCookie('access_token', Response.body.access_token, {
                        path: '/' + this.nation,
                        expiry: new Date().getTime() + 31556926,
                    });
                    cy.setCookie('refresh_token', Response.body.refresh_token, {
                        path: '/' + this.nation,
                        expiry: new Date().getTime() + 31556926,
                    });
                })
        })
    }
    requestSearch() {
        cy.request({
            method: 'POST',
            url: this.url + '/search/product/_search',
            body:{
                "query": {
                    "bool": {
                        "must": {
                            "nested": {
                                "path": "categories",
                                "filter": {
                                    "term": {
                                        "categories.permalink": "sofas"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        .then((Response) =>{
            return '12312312312'
        })
    }
}

export default GARequest