const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

router.post("/", async (req,res)=>{

    const {title,content,userId} = req.body;

    const note = new Note({
        title,
        content,
        userId
    });

    await note.save();

    res.json(note);

});


router.get("/:userId", async (req,res)=>{

    const notes = await Note.find({
        userId:req.params.userId
    });

    res.json(notes);

});


router.put("/:id", async (req, res) => {
    const { title, content } = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { returnDocument: "after" }
        );

        res.json({ success: true, note: updatedNote });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.delete("/:id", async (req,res)=>{

    await Note.findByIdAndDelete(req.params.id);

    res.json({message:"Deleted"});
});

module.exports = router;