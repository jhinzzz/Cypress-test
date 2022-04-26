/// <reference types="cypress" />

const Mock = require("mockjs");

/*
    SG LLT product needs to be updated before 25/05/2022
*/

/*---------------------------断言结果---------------------------*/
let llt_display_res = false;
let llt_subscribe_res = false;
let llt_close_res = false;
let llt_text_res = false;
let llt_notify_res = false;
let email = Mock.mock("@email");
/*---------------------------前置数据定义---------------------------*/
let label; //label设置
const d = new Date();
const date = d.toLocaleDateString();

describe("SG test", () => {
  /*---------------------------前置数据设置---------------------------*/
  before("product information prepared", () => {
    expect(date, "today is no need to update product").to.not.equal("2022/5/25"); //先判断是否需要更新产品
    // 设置cookie并判断cookie是否设置成功
    cy.setCookie('select_country_hint_hidden', 'true')
    cy.getCookie('select_country_hint_hidden').should('have.property','value', 'true')
    
    cy.request(
      "GET",
      Cypress.env("SG_API") + "/v2" + Cypress.env("SG_LLT")  //更新产品直接切换后面的url参数即可
    ).then((response) => {
      label = response.body.variants[0].sku;
      label += " | ";
      label += response.body.variants[0].name;
    });
  });

  /*---------------------------测试主体---------------------------*/
  it("LLT test", () => {
    cy.visit(Cypress.env("SG_HPG") + Cypress.env("SG_LLT"));

    cy.get('[data-selenium="add_to_cart"]').click(); //触发LLT_popup_dispaly
    cy.get(".ZKM6kW__button")
      .click({ force: true })
      .then(() => {
        //触发LLT_popup_display
        cy.get(".ZKM6kW__emailWrapper")
          .find("input")
          .click({ force: true })
          .type(email, { force: true }); // 输入subscribe邮箱
        cy.get(".ZKM6kW__emailWrapper").find("button").click({ force: true }); //触发LLT_subscribe
      });
    cy.wait(1000);
    cy.get(".ZKM6kW__container").find('[aria-label="close"]').click(); //触发LLT_popup_close

    cy.window().then((win) => {
      win.dataLayer.some((dl) => {
        //测试LLT_text
        if (
          dl["eventDetails.category"] === "long_leadtime" &&
          dl["eventDetails.action"] === "pdp_text_impression" &&
          dl["eventDetails.label"] === label
        ) {
          llt_text_res = true;
        }
        //测试LLT_popup_display
        if (
          dl["eventDetails.category"] === "long_leadtime" &&
          dl["eventDetails.action"] === "popup_display" &&
          dl["eventDetails.label"] === label
        ) {
          llt_display_res = true;
        }
        //测试LLT_subscribe
        if (
          dl["eventDetails.category"] === "long_leadtime" &&
          dl["eventDetails.action"] === "subscribe" &&
          dl["eventDetails.label"] === label
        ) {
          llt_subscribe_res = true;
        }
        //测试LLT_popup_close
        if (
          dl["eventDetails.category"] === "long_leadtime" &&
          dl["eventDetails.action"] === "popup_close" &&
          dl["eventDetails.label"] === label
        ) {
          llt_close_res = true;
        }
      });
      /*---------------------------------------------断言判断---------------------------------------------*/
      expect(llt_text_res, "is send LLT text").to.equal(true);
      expect(llt_display_res, "is send LLT popup display").to.equal(true);
      expect(llt_subscribe_res, "is send LLT subscribe").to.equal(true);
      expect(llt_close_res, "is send LLT popup close").to.equal(true);
    });
  });
});
