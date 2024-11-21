import { rest } from 'msw';
import { randomUUID } from 'crypto';
export const handlers = [
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/list`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "data": [
          {
            "name": "label",
            "key": "value"
          }
        ]
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/list`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "data": [
          {
            "name": "label",
            "key": "value"
          }
        ]
      })
    )
  }),
  rest.post(`${process.env.REACT_APP_API_BASE_URL}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Success',
        dom_uuid: randomUUID()
      })
    )
  }),
];
