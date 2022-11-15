// PDP相关的对象获取

class ProductDetailPage{
    // 根据面包屑获取产品的category
    getCategory() {
        return cy.get("span.is-active").prev().find("a")
    };
    // 根据面包屑获取产品的dimension
    getDimension() {
        cy.get("span.is-active").prev().prev().then(($a)=>{
             return $a.text();
          });
    };
    // 点击下一个image
    getImage() {
        return cy.get('li.slick-active').next();
    };
    // 获取wishlist按钮
    getWishList(){
        return cy.get('[data-selenium="add_to_wishlist"]');
    }
    // 点击心愿单按钮
    clickWishList(){
        return cy.get('[data-selenium="add_to_wishlist"]').click();
    }
    // 获取购买按钮
    getATC(){
        return cy.get('[data-selenium="add_to_cart"]')   ;
    }
    // 获取删除product的按钮
    getRemove(){
        return cy.get('[data-selenium="cart-item-remove"]');
    }
    // 获取关闭Cart的按钮
    getCloseCart(){
        return cy.get('[data-selenium="close-cart"]')
    }
    // 获取打开Swatch弹窗的按钮
    getSwatch(){ 
        return cy.get('[data-selenium="open_swatch"]')
    }
    // 获取第一个Swatch的文本
    getSwatchText() {
        return cy.get('[data-selenium="add_remove_swatch"]:first').prev('h4')
    }
    // 添加第一个Swatch
    addSwatch(){
        return this.getSwatch().click().then(() => {
            cy.get('[data-selenium="add_remove_swatch"]:first').click();
        })
    }
    // 关闭Swatch弹窗
    closeSwatch() {
        return cy.get('svg[aria-label="dismiss"]').click();
    }
    // 获取切换material的按钮
    getMaterials(){
        return cy.get('[data-selenium="material"]')
    }
    // 轮流切换至不同的material
    clickMaterials(){
        return this.getMaterials().click({multiple:true})
    }
    // 切换至第一个material
    clickFirstMaterial() {
        return cy.get('[data-selenium="material"]:first').click({force:true})
    }
    clickOption(length) {
        return cy.get("h4").contains("Miles Dining Table").click().then(()=>{
            cy.get("button").contains(length).click().then(()=>{
                cy.get("button").contains("Confirm").click()
            })
        }); 
    }
    // 获取点击x_reviews的按钮
    getXReviews(){
        return cy.get('[data-selenium="x_reviews"]')
    }
    // 点击x_reviews
    clickXReviews(){
        return this.getXReviews().click({force:true})
    }
    // 获取触发review dropdown的按钮
    getReviewDropdown(){
        return cy.get('[data-selenium="review_dropdown"]')
    }
    // 点击most recent
    clickMostRecent(){
        return this.getReviewDropdown().click().then(() => {
            cy.contains("Most Recent").click();     
          });
    }
    // 获取展开installment的按钮
    getInstallmentExpand(nation){
        if(nation == 'au'){
            return cy.get('[data-selenium="installment_expand"]')
        }
        if(nation == 'us'){
            return cy.get('[aria-label="Prequalify now about Affirm Financing (opens in modal)"]')
        }
    }
    // 获取关闭installment的按钮
    getInstallmentClose(nation){
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
        return cy.get("div").contains("Product Material & Care"); 
    }
    // 获取展开property的按钮
    getPropertyExpand(product_detail_value){
        return cy.get("span").contains(product_detail_value).find("svg");
    }
    // 获取关闭property的按钮
    getPropertyClose(){
        return cy.get("div.ZPYEqa__explanationModal")
        .find('svg[aria-label="dismiss"]');
    }
    // 获取展开dimension的按钮
    getDimensions(){
        return cy.get("div").contains("Product Dimensions")
    }
    // 获取展开delivery的按钮
    getDelivery(){
        return cy.get("div").contains("Delivery & Warranty")
    }
}
export default ProductDetailPage