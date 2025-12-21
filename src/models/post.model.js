import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  content: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug before saving
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for duplicate slugs
    while (
      await mongoose.models.Post.findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  this.updated_at = Date.now();
  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
