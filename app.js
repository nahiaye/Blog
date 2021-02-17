//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lorem ipsum is the standard dummy text for many websites. Its origins reside in De finibus bonorum et malorum (On the ends of good an evil), a philosophical work by Cicero written in 45 BC. Lipsum.com takes the original Latin translation and puts it into a nonsensical order.In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design. Lorem ipsum is typically a corrupted version of 'De finibus bonorum et malorum', a 1st century BC text by the Roman statesman and philosopher Cicero, with words altered, added, and removed to make it nonsensical and improper Latin. Versions of the Lorem ipsum text have been used in typesetting at least since the 1960s, when it was popularized by advertisements for Letraset transfer sheets. Lorem ipsum was introduced to the digital world in the mid-1980s, when Aldus employed it in graphic and word-processing templates for its desktop publishing program PageMaker. Other popular word processors including Pages and Microsoft Word have since adopted Lorem ipsum as well.";
const aboutContent = "This is a blog website that allows you to write anything that's on your mind. You can go to the compose page and publish a new blog post. To access it, go to the home page and click on read more next to your blog post. Feel free to thank the creator in the footer page where you can find his/hers social media accounts.";
const contactContent = "If you have any questions, contact us!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://MYUSERNAME:MYPASSWORD@blogommie.kv57t.mongodb.net/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
    title: String,
    content: String
}
const Post = mongoose.model("Post", postSchema);
app.get("/", function(_req, res) {
    Post.find({}, function(_err, posts) {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
});
app.get("/about", function(_req, res) {
    res.render("about", { middleContent: aboutContent });
});
app.get("/contact", function(_req, res) {
    res.render("contact", { endContent: contactContent });
});
app.get("/compose", function(_req, res) {
    res.render("compose");
});
app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    post.save(function(err) {
        if (!err) {
            res.redirect("/");
        }
    });
});
app.get("/posts/:postId", function(req, res) {
    const requestedPostId = req.params.postId;
    Post.findOne({ _id: requestedPostId }, function(_err, post) {
        res.render("post", {
            title: post.title,
            content: post.content
        });
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});
