const router = require('express').Router();

const Posts = require('./db')

// GET requests

// get all posts 

router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved." })
    })
})

// get post with the specified id

router.get('/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

// get an array of all comment objects associated to with the post with the specified id

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comment => {
        if (!comment){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json(comment)
        }
    })
    .catch(error => {
        res.status(500).json({error: "The comments information could not be retrieved." })
    })
})

// POST requests

router.post('/', (req, res) => {
    const {title, contents} = Posts.insert(req.body)
    .then(posts => {
        title || contents ? res.status(400).json({errorMessage: "Please provide title and contents for the post."}) : res.status(201).json(posts);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error while saving the post to the database"})
    })
})
module.exports = router;