/* global describe, test, expect */

import cheerio from 'cheerio'

export default function ({ app }, suiteName, render) {
  async function get$ (path) {
    const html = await render(path)
    return cheerio.load(html)
  }

  describe(suiteName, () => {
    test('renders a stateless component', async () => {
      const html = await render('/stateless')
      expect(html.includes('<meta charset="utf-8" class="next-head"/>')).toBeTruthy()
      expect(html.includes('My component!')).toBeTruthy()
    })

    test('renders a stateful component', async () => {
      const $ = await get$('/stateful')
      const answer = $('#answer')
      expect(answer.text()).toBe('The answer is 42')
    })

    test('header helper renders header information', async () => {
      const html = await (render('/head'))
      expect(html.includes('<meta charset="iso-8859-5" class="next-head"/>')).toBeTruthy()
      expect(html.includes('<meta content="my meta" class="next-head"/>')).toBeTruthy()
      expect(html.includes('I can haz meta tags')).toBeTruthy()
    })

    test('css helper renders styles', async () => {
      const $ = await get$('/css')
      const redBox = $('#red-box')

      expect(redBox.text()).toBe('This is red')
      expect(redBox.attr('class')).toMatch(/^css-/)
    })

    test('renders styled jsx', async () => {
      const $ = await get$('/styled-jsx')
      const styleId = $('#blue-box').attr('data-jsx')
      const style = $(`#__jsx-style-${styleId}`)

      expect(style.text()).toMatch(/color: blue/)
    })

    test('renders properties populated asynchronously', async () => {
      const html = await render('/async-props')
      expect(html.includes('Diego Milito')).toBeTruthy()
    })

    test('renders a link component', async () => {
      const $ = await get$('/link')
      const link = $('a[href="/about"]')
      expect(link.text()).toBe('About')
    })

    test('error', async () => {
      const $ = await get$('/error')
      expect($('pre').text()).toMatch(/This is an expected error/)
    })

    test('error 404', async () => {
      const $ = await get$('/non-existent')
      expect($('h1').text()).toBe('404')
      expect($('h2').text()).toBe('This page could not be found.')
    })
  })
}
