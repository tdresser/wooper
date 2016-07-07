import { WooperPage } from './app.po';

describe('wooper App', function() {
  let page: WooperPage;

  beforeEach(() => {
    page = new WooperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
