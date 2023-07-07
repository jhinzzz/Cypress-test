// 创建一个名为 "link-validator.spec.js" 的测试文件

// 导入 Cypress
import 'cypress';

// 定义测试套件
describe('Link Validator', () => {
  // 在每个测试用例之前执行的操作
  beforeEach(() => {
    cy.visit('https://www.castlery.com/au'); // 替换为您要测试的网页的 URL
  });

  // 定义测试用例
  it('should validate all links', () => {
    cy.get('a') // 获取网页中的所有链接
      .each((link) => {
        href = link.prop('href'); // 获取链接的 href 属性

        // 发送请求并获取链接的状态码
        cy.request({
          url: href,
          method: 'GET',
          failOnStatusCode: false,
        }).then((response) => {
          statusCode = response.status; // 获取响应的状态码

          if (statusCode !== 200) {
            cy.log(`Link: ${href} | Status Code: ${statusCode}`); // 打印异常链接和状态码
          }
        });
      });
  });
});
