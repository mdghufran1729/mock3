const express = require('express');
const router = express.Router();
const Classified = require('../model/classified');

// Route to post a new classified
router.post('/post', (req, res) => {
  const { name, description, category, image, location, postedAt, price } = req.body;

  const newClassified = new Classified({
    name,
    description,
    category,
    image,
    location,
    postedAt,
    price,
  });

  newClassified.save()
    .then((classified) => {
      res.send(classified);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error posting the classified' });
    });
});

// Route to fetch all classifieds with optional filtering, sorting, and pagination
router.get('/browse',async(req, res) => {
    const { category,q, sort, page, limit } = req.query;
    const query = {};
  
    // Apply filters if category is provided in the query parameters
    if (q){
        // const findByName=await Classified.find({name:q})
        // res.send(findByName);
        query.name=q;
    }
    if (category) {
      query.category = category;
    }
  
    let sortOptions = { postedAt: -1 }; // Default sorting by postedAt in descending order
  
    // Apply sorting if sort is provided in the query parameters
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    }
  
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
  
    // Calculate the skip value to implement pagination
    const skip = (pageNumber - 1) * itemsPerPage;
  console.log(query)
    Classified.find(query)
      
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage)
      .then((classifieds) => {
        res.json(classifieds);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching classifieds' });
      });
   
  // Implement filtering, sorting, and pagination logic here
  // For brevity, let's assume no filters, sorting, and pagination
 
});

// Route to delete a classified by ID
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  Classified.findByIdAndDelete(id)
    .then((classified) => {
      if (!classified) {
        return res.status(404).json({ error: 'Classified not found' });
      }
      res.json({ message: 'Classified deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error deleting the classified' });
    });
});

module.exports = router;
