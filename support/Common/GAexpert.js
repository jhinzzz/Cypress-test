

class GAExpert {
    constructor(win){
        this.window = win
        console.log('这是', this.dataLayer)
    }

    IsTest() {
        this.win.dataLayer.some((dl) => {
            if (
                this.dataLayer.event === "pageview" &&
                this.dataLayer.pageCat === "product-detail" &&
                this.dataLayer.pageType === "product"
              ) {
                return true
            }
              else {
                return false
            }
        })
    }
}

export default GAExpert