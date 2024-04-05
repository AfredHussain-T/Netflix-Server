const router = require("express").Router();
const Movie = require("../models/Movie");
const { verify } = require("../config/jwtProvider");

// Create new movie

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = await new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      return res.status(200).send(savedMovie);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(401).send("Unauthorized User To Add Movie");
  }
});

// Update Movie

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      return res.status(201).send(updatedMovie);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(401).send("Unauthorized User To Update Movie");
  }
});

// Delete Movie

router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id );
  
        return res.status(201).send({deletedMovie, message:"Movie has been deleted"});
      } catch (error) {
        return res.status(500).send(error);
      }
    } else {
      return res.status(401).send("Unauthorized User To Delete Movie");
    }
});

// Get a movie

router.get("/find/:id", verify, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id );
        return res.status(201).send({movie});
      } catch (error) {
        return res.status(500).send(error);
      }
});

// Get a random movie

router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if(type === "series"){
            movie = await Movie.aggregate([
                {$match:{isSeries:true}},
                {$sample:{size:1}}
            ])
        }else{
            movie = await Movie.aggregate([
                {$match:{isSeries:false}},
                {$sample:{size:1}}
            ])
        }

        return res.status(200).send(movie);
      } catch (error) {
        return res.status(500).send(error);
      }
});


// Get All

router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const movies = await Movie.find();
  
        return res.status(201).json(movies.reverse());
      } catch (error) {
        return res.status(500).send(error);
      }
    } else {
      return res.status(401).send("Unauthorized User To Delete Movie");
    }
});


module.exports = router;