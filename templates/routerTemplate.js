module.exports = (controllerName) => {

return `
const express = require('express');
const router = express.Router();
const ${controllerName} = require('../controllers/${controllerName}.js');

/*
 * GET
 */
router.get('/${controllerName}', ${controllerName}.list);

/*
 * GET
 */
router.get('/${controllerName}/:id', ${controllerName}.show);

/*
 * POST
 */
router.post('/${controllerName}/', ${controllerName}.create);

/*
 * PUT
 */
router.put('/${controllerName}/:id', ${controllerName}.update);

/*
 * DELETE
 */
router.delete('/${controllerName}/:id', ${controllerName}.remove);

module.exports = router;

`
};