import { Router } from "express";

const router = Router();

router.get('/api/products', (req, res) => {
  // console.log(req.headers.cookie);
  console.log( req.headers.cookie );
  console.log(req.cookies);
  if (req.cookies.hellow && req.cookies.hellow ==='world')
    return res.send([
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
        { id: 3, name: "Product 3", price: 300 },
      ]);
  return res.send({msg: "Sorry, you need to correct cookie"})
})

export default router;