import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'La imagen en Base64 es obligatoria'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model('Post', postSchema);
