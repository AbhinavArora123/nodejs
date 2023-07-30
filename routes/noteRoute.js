const express=require("express");
const { getAllNotes, createNote, updateNote, deleteNote, noteDetails } = require("../controllers/noteController");
const { isAuthenticatedUser } = require("../middleware/auth");


const router=express.Router();

router.route("/note/new").post(isAuthenticatedUser,createNote);

router.route("/notes").get(isAuthenticatedUser,getAllNotes);

router.route("/note/:id").put(isAuthenticatedUser,updateNote);

router.route("/note/:id").delete(isAuthenticatedUser,deleteNote).get(isAuthenticatedUser ,noteDetails);

module.exports=router;