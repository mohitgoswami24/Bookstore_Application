const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 4005;


//mongodb Connection
mongoose.connect("mongodb://localhost:27017/BookStore-App", {useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Connected with Mongodb")
}).catch((err)=>{
    console.log(err)
})

//Schema for Item
const itemSchema = new mongoose.Schema({
    item: String,
    desc: String,
})

const Item = new mongoose.model('Item', itemSchema)

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());




//creating item
app.post("/api/items", async (req,res)=>{
const item = await Item.create(req.body);
res.status(200).json({
    success: true,
    message: 'item created successfully',
    item
})
})

//get all item
app.get("/api/items", async (req, res) => {
    const items = await Item.find();
    res.status(200).json({
        success: true,
        message: "All items in the list",
        items
    })
})

//updating item using id
app.put("/api/items/:id", async (req, res) => {
    try{
        let item = await Item.findById(req.params.id);

        item = await Item.findByIdAndUpdate(req.params.id, req.body, 
            {new:true,
             useFindAndModify: true,
             runValidators: true})
    
        res.status(200).json({
            success: true,
            message: "item updates successfully",
            item
        })

    }catch(error){
        
        console.error('Error retrieving item:', error);
        res.status(500).json({ error: 'Failed to retrieve item' });

    }
})

//get item by id
app.get("/api/items/:id",async (req, res) => {
    try {
      const itemId = req.params.id;
      const item = await Item.findById(itemId);
      
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error retrieving item:', error);
      res.status(500).json({ error: 'Failed to retrieve item' });
    }
  });

  
  
  

//deleting an item using id of particular item
app.delete("/api/items/:id", async(req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findByIdAndDelete(itemId);
        
        if (!item) {
          res.status(404).json({ error: 'Item not found' });
          return;
        }
        
        res.json({ message: 'Item deleted successfully' });
      } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
      }
})


app.listen(port, function (err) {
    if (err) {
      console.log("error");
      return;
    } 
    console.log(`server is running on ${port}`);
});