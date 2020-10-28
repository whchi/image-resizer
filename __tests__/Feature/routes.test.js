import request from 'supertest'
import app from '../../app'

describe('rootRoute', () => {
  test('Health check works', async () => {
    const response = await request(app.callback()).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('success')
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
