const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    publishedAt: Date
  },
  {
    timestamps: true,
    versionKey: false
  }
);

postSchema.pre('save', function setSlug(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

module.exports = mongoose.model('Post', postSchema);

