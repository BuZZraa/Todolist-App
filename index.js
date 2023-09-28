import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/notesDB").then(() => console.log('Connected!'));

const noteSchema = new mongoose.Schema({
  notes: String
});


const notesModel = mongoose.model("note", noteSchema);

const note1 = new notesModel({
  notes:"Buy groceries."
});

const note2 = new notesModel({
  notes:"Pay rent."
});

const note3 = new notesModel({
  notes:"Get to the dentist appointment."
});



//To pass form data to index.ejs, bodyparser middleware is used.
app.use(bodyParser.urlencoded({ extended: true }));

//Static folder declared for styling files.
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

//get method to handle get request and send response accordingly.
app.get("/", async (req, res) => {
    try 
      {
        const notes = await notesModel.find();
        if(notes.length === 0) 
          {
            notesModel.insertMany([note1, note2, note3]);
            try 
            {
              const notes = await notesModel.find();
              res.render("index.ejs", {notes:notes});
              console.log("No data were found, example data inserted!");
              }

            catch(err) 
              {
                console.log(err);
              }
          }

        else 
          {
            res.render("index.ejs",{notes:notes});
          }
      }
    
    catch(err) 
      {
        console.log(err);
      }
  });

//post method to handle post request and send response by rendering a file and passing the form data as object through the render method.
app.post("/add", async (req, res) => {
    var note =  req.body["note"];
    if(note != "") {
      try 
        {
          const sendNote = new notesModel({
            notes:note
          });
          sendNote.save()
          res.redirect("/");
          console.log("New data entered successfully!")
        }
      
      catch(err) {
        console.log(err)
      }
      
    }

    else {
      res.redirect("/");
    }
  });

app.post("/delete", async(req,res)=> {
  const checkboxId = req.body["checkbox"];
    try {
      const deleteNote = await notesModel.deleteOne({_id:checkboxId});
      console.log(deleteNote);
    }

    catch(err) {
      console.log(err);
    }
  setTimeout(function() {
    res.redirect("/");
  },300)
});