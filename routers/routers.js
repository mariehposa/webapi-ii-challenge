const express = require('express')


const db = require('../data/db')

const router = express.Router()

router.post('/', postContents)
router.post('/:id/comments', postComments)
router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.delete('/:id', deletePost)
router.put('/:id', updatePost)


function postContents (req, res) {
    const {title, contents} = req.body;
    if (req.body) {
        const info = {
            title: title,
            contents: contents
        }
        db.insert(info)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            })
        })
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
}

function postComments(req, res) {
    const { text } = req.body;
    const {id } = req.params;

    db.findById(id)
    .then(post => {
        if (post.length > 0 ) {
            if (text && id) {
                const comment = {
                                text: text,
                                post_id: id
                            }
                db.insertComment(comment)
                .then( data => {
                    res.status(201).json(data)
                })
                .catch(err => {
                    res.status(500).json({
                        error: "There was an error while saving the comment to the database"
                    })
                })
            } else {
                res.status(400).json({ 
                    errorMessage: "Please provide text for the comment." 
                })
            }
        } else {
            res.status(404).json({ 
                message: "The post with the specified ID does not exist." 
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'An error occured'
        })
    })
}

function getAllPosts(req, res) {
    db.find()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({
            error: "The posts information could not be retrieved."
        })
    })
}

function getPostById(req, res) {
    const { id } = req.params;
    if (id) {
        db.findById(id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
    } else {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    }
}

function deletePost (req, res) {
    const { id } = req.params;
    if (id) {
        db.remove(id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
    } else {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    }
}

function updatePost (req, res) {
    const { id } = req.params;
    const {title, contents} = req.body;

    db.findById(id)
    .then(data => {
        if (data.length > 0) {
            if (title && contents) {
                db.update(id, {title, contents})
                .then(data => {
                    res.status(200).json(data)
                })
                .catch(err => {
                    res.status(500).json({
                        error: "The post information could not be modified."
                    })
                })
            } else {
                res.status(400).json({
                    errorMessage: "Please provide title and contents for the post."
                })
            }
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        res.status(404).json({
            message: "An error occured"
        })
    })
}


module.exports = router;