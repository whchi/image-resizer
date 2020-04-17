const request = require('supertest')
const resolve = require('path').resolve
const app = require(resolve('app'))
const settings = require('settings.json')

describe('rootRoute', () => {
  test('Health check works', async () => {
    const response = await request(app.callback()).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('success')
  })
  test('建立白名單', async () => {
    const response = await request(app.callback())
      .post('/white-list')
      .set('authorization', settings.token)
      .send({ hosts: settings.hosts, buckets: settings.buckets })
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })

  test('取得白名單', async () => {
    const response = await request(app.callback())
      .get('/white-list')
      .set('authorization', settings.token)
    expect(response.body.success).toBe(true)
    expect(response.body.items.length).toBeGreaterThan(0)
    expect(response.body.items[0].hosts).toEqual(settings.hosts)
    expect(response.body.items[0].buckets).toEqual(settings.buckets)
    expect(response.status).toBe(200)
  })
})

describe('resizeRoute', () => {
  test('白名單內縮圖', async () => {
    let uri =
      'https%3A%2F%2Fec.cw1.tw%2Fcwbook%2Fimages%2FResource%2Fweb%2Fproduct%2F6%2F0000020276%2F0000020276.jpg'
    const response = await request(app.callback()).get(
      `/resize/uri/${uri}/?w=100&h=200&format=webp`
    )
    expect(response.status).toBe(200)
    expect(response.type).toBe('image/webp')
  })
  test('白名單外縮圖', async () => {
    let uri = 'https%3A%2F%2Fi.imgur.com%2F6wyVydp.jpeg'

    const response = await request(app.callback()).get(
      `/resize/uri/${uri}/?w=100&h=200&format=webp`
    )
    expect(response.status).toBeGreaterThanOrEqual(400)
  })
})
