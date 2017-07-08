import { JoppaPage } from './app.po';

describe('joppa App', () => {
  let page: JoppaPage;

  beforeEach(() => {
    page = new JoppaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
