module.exports = (modelName) => {

    return `const ${modelName} = require('../models/${modelName}Schema.js');

/**
 * ${modelName}.js
 *
 * @description :: Server-side logic for managing ${modelName}.
 */
module.exports = {

    /**
     * ${modelName}.list()
     */
    list: function (req, res) {
        ${modelName}.find(function (err, listOf${modelName}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ${modelName}.',
                    error: err
                });
            }
            return res.json(listOf${modelName});
        });
    },

    /**
     * ${modelName}.show()
     */
    show: function (req, res) {
        let id = req.params.id;
        ${modelName}.findOne({_id: id}, function (err, found${modelName}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ${modelName}.',
                    error: err
                });
            }
            if (!found${modelName}) {
                return res.status(404).json({
                    message: 'No such ${modelName}'
                });
            }
            return res.json(found${modelName});
        });
    },

    /**
     * ${modelName}.create()
     */
    create: function (req, res) {
        let data = req.body;
        let toCreate = new ${modelName}({...data});

        toCreate.save(function (err, created${modelName}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating ${modelName}',
                    error: err
                });
            }
            return res.status(201).json(created${modelName});
        });
    },

    /**
     * ${modelName}.update()
     */
    update: function (req, res) {
        let id = req.params.id;
        ${modelName}.findOne({_id: id}, function (err, toUpdate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ${modelName}',
                    error: err
                });
            }
            if (!toUpdate) {
                return res.status(404).json({
                    message: 'No such ${modelName}'
                });
            }
            let updateData = req.body;
            toUpdate = {...toUpdate,updateData};
            toUpdate.save(function (err, updated) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating ${modelName}.',
                        error: err
                    });
                }

                return res.json(updated);
            });
        });
    },

    /**
     * ${modelName}.remove()
     */
    remove: function (req, res) {
        let id = req.params.id;
        ${modelName}.findByIdAndRemove(id, function (err, toRemove) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the ${modelName}.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};`

};