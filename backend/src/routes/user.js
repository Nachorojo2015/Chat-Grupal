import { Router } from "express";

const userRouter = Router();

// Cambiar imagen del usuario
userRouter.put("/picture/:id", async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  try {
    const user = await usersModel.findById(id);
    user.thumbnail = url;
    await user.save();
    res.status(200).json({ message: "Picture updated", status: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: false,
      message: "Error updating user picture",
    });
  }
});

export { userRouter };