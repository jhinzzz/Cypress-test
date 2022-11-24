import ProductDetailPage from "../PageObject/ProductDetailPage";
import GATracing from "../Common/GATracing";

class ProductDetailOperation{
    constructor(nation, pageType) {
        this.nation = nation;
        this.pageType = pageType;
        this.product = new ProductDetailPage();
        this.GA = new GATracing(this.nation, this.pageType);
    }

    checkoutFlow(pageType) {
            this.product.getATC().click().then(() => {
                this.product.getCheckout().click();
                this.GA.assertCheckout('1');
            });
    }

    RemoveCart() {
        this.product.getCart().click().then(() => {
            this.product.getRemove().click();
        })
    }
}

export default ProductDetailOperation;