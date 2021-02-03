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

//create a new post using the information sent inside the request body

router.post('/', (req, res) => {
    const {title, contents} = Posts.insert(req.body)
    .then(posts => {
        title || contents ? res.status(400).json({errorMessage: "Please provide title and contents for the post."}) : res.status(201).json(posts);
    })
    .catch(error => {
        res.status(500).json({error: "There was an error while saving the post to the database"})
    })
})

// creates a comment for the post with the specified id using information sent inside of the request body

router.post('/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
           !post[0] ?
            res.status(404).json({ message: "The post with the specified ID does not exist." }) :
            req.body.text ?
            Posts.insertComment(req.body)
                .then(post => res.status(201).json(post)) :
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})

// DELETE request - deletes the post with the specified id

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(count => {
        count > 0 ? res.status(200).json({ message: "Post successfully deleted"}) : res.status(404).json({message: "The post with the specified ID does not exist." })
    })
    .catch(error => {
        res.status(500).json({error: "The post could not be removed"})
    })
})

// PUT request - updates the post with the specified id using data from the request body

router.put('/:id', (req, res) => {
    const updates = req.body;
    const id = req.params.id;
    Posts.findById(id)
    .then(changes => {
        if(changes) {
        res.status(201).json(changes);
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist." })
        };
        if (!updates.text){
            Posts.update(id, updates)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(error => {
                res.status(400).json({errorMessage: "Please provide text for the comment"});
            });
        } else if (!user.id) {
            res.status(404).json({message: "The post with the specified ID does not exist"})
        } 
    })
    .catch(error => {
        res.status(500).json({error: "There was an error while saving the comment to the database"})
    })
})


module.exports = router;