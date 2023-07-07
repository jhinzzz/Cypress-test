// PDP相关的对象获取

class ProductDetailPage{
    // 根据面包屑获取产品的category
    getCategory() {
        // cy.allure().step('Get category');
        return cy.get("span.is-active").prev().find("a")
    };
    // 根据面包屑获取产品的dimension
    getDimension() {
        // cy.allure().step('Get dimension');
        cy.get("span.is-active").prev().prev().then(($a)=>{
             return $a.text();
          });
    };
    // 点击下一个image
    getImage() {
        // cy.allure().step('Get image');
        return cy.get('li.slick-active').next();
    };
    // 获取wishlist按钮
    getWishList() {
        // cy.allure().step('Get wishlist');
        return cy.get('[data-selenium="add_to_wishlist"]');
    }
    // 点击心愿单按钮
    clickWishList() {
        // cy.allure().step('Click wishlist');
        return cy.get('[data-selenium="add_to_wishlist"]').click();
    }
    // 获取购买按钮
    getATC() {
        // cy.allure().step('Get ATC button');
        return cy.get('[data-selenium="add_to_cart"]').contains("Add To Cart");
    }
    getCart() {
        // cy.allure().step('Get cart button');
        return cy.get('[data-selenium="header-cart"]');
    }
    // 获取删除product的按钮
    getRemove(){
        // cy.allure().step('Get remove button');
        return cy.get('[data-selenium="cart-item-remove"]');
    }
    getCheckout(){
        // cy.allure().step('Get checkout button');
        return cy.get('[data-selenium="check-out"]');
    }
    // 获取关闭Cart的按钮
    getCloseCart(){
        // cy.allure().step('Get close button');
        return cy.get('[data-selenium="close-cart"]')
    }
    // 获取打开Swatch弹窗的按钮
    getSwatch(){ 
        // cy.allure().step('Get swatch button');
        return cy.get('[data-selenium="open_swatch"]')
    }
    // 获取第一个Swatch的文本
    getSwatchText() {
        // cy.allure().step('Get swatch text');
        return cy.get('[data-selenium="add_remove_swatch"]:first').prev('h4')
    }
    // 添加第一个Swatch
    addSwatch(){
        // cy.allure().step('Add swatch');
        return this.getSwatch().click().then(() => {
            cy.get('[data-selenium="add_remove_swatch"]:first').click();
        })
    }
    // 关闭Swatch弹窗
    closeSwatch() {
        // cy.allure().step('Close swatch popup');
        return cy.get('svg[aria-label="dismiss"]').click();
    }
    // 获取切换material的按钮
    getMaterials(){
        // cy.allure().step('Get material');
        return cy.get('[data-selenium="material"]')
    }
    // 轮流切换至不同的material
    clickMaterials(){
        // cy.allure().step('Click material');
        return this.getMaterials().click({multiple:true})
    }
    // 切换至第一个material
    clickFirstMaterial() {
        // cy.allure().step('Switch to first material');
        return cy.get('[data-selenium="material"]:first').click({force:true})
    }
    clickOption(length) {
        // cy.allure().step('Click bundle option');
        return cy.get("h4").contains("Miles Dining Table").click().then(()=>{
            cy.get("button").contains(length).click().then(()=>{
                cy.get("button").contains("Confirm").click()
            })
        }); 
    }
    // 获取点击x_reviews的按钮
    getXReviews(){
        // cy.allure().step('Get X reviews');
        return cy.get('[data-selenium="x_reviews"]')
    }
    // 点击x_reviews
    clickXReviews(){
        // cy.allure().step('Click X reviews');
        return this.getXReviews().click({force:true})
    }
    // 获取触发review dropdown的按钮
    getReviewDropdown(){
        // cy.allure().step('Get review dropdown');
        return cy.get('[data-selenium="review_dropdown"]')
    }
    // 点击most recent
    clickMostRecent(){
        // cy.allure().step('Click most recent option');
        return this.getReviewDropdown().click().then(() => {
            cy.contains("Most Recent").click();     
          });
    }
    // 获取展开installment的按钮
    getInstallmentExpand(nation){
        // cy.allure().step('Get installment button');
        if(nation == 'au'){
            return cy.get('[data-selenium="installment_expand"]')
        }
        if(nation == 'us'){
            return cy.get('[aria-label="Prequalify now about Affirm Financing (opens in modal)"]')
        }
    }
    // 获取关闭installment的按钮
    getInstallmentClose(nation){
        // cy.allure().step('Close Installment popup');
        if (nation == 'au') {
            cy.get('iframe').then(($iframe) => {
                cy.get('img.close-button').click();
            });
        }
        else if (nation == 'us'){
            cy.get('iframe.affirm-sandbox-iframe').then(($iframe) => {
                cy.get('div.affirmBrand').then(() => {
                    console.log('找到了iframe')
                    cy.get('button#close-button').click()
                })
        
            })
        }
        else{
            cy.get('[data-selenium="installment_close"]')
        };
    }
    // 获取展开details的按钮
    getDetail(){
        // cy.allure().step('Get product details');
        return cy.get("div").contains("Product Material & Care"); 
    }
    // 获取展开property的按钮
    getPropertyExpand(product_detail_value){
        // cy.allure().step('Get product property');
        return cy.get("span").contains(product_detail_value).find("svg");
    }
    // 获取关闭property的按钮
    getPropertyClose(){
        // cy.allure().step('Close product property');
        return cy.get("div.ZPYEqa__explanationModal")
        .find('svg[aria-label="dismiss"]');
    }
    // 获取展开dimension的按钮
    getDimensions(){
        // cy.allure().step('Get product dimension');
        return cy.get("div").contains("Product Dimensions")
    }
    // 获取展开delivery的按钮
    getDelivery(){
        // cy.allure().step('Get product delivery');
        return cy.get("div").contains("Delivery & Warranty")
    }
}
export default ProductDetailPage