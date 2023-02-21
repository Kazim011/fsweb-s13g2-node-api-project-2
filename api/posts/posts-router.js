// post routerları buraya yazın

const express = require("express");
const postModel = require("../posts/posts-model");
const { route } = require("../server");

const router = express.Router();

const Posts = require("./posts-model");

router.get("/", (req, res) => {
  postModel
    .find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((findPosts) => {
      if (!findPosts) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.json(findPosts);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

// router.post("/", (req, res) => {
//   const { title, contents } = req.body;
//   if (!title || !contents) {
//     res
//       .status(400)
//       .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
//   } else {

//     Posts.insert({ title, contents })
//       .then(({ id }) => {
//         Posts.findById(id).then((findPosts) => {
//           res.status(201).json(findPosts);
//         });
//       })
//       .catch((err) => {
//         res
//           .status(500)
//           .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
//       });
//   }
// });

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    try {
      let { id } = await Posts.insert({ title, contents });
      let insertPost = await Posts.findById(id);
      res.status(201).json(insertPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

router.put("/:id", async (req, res) => {
  let post = await Posts.findById(req.params.id);
  if (!post) {
    res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
  } else {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      try {
        let updatedPostId = await Posts.update(req.params.id, req.body);
        let updatedPost = await Posts.findById(updatedPostId);
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
      }
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let existPost = await Posts.findById(req.params.id);
    if (!existPost) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(existPost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let existPost = await Posts.findById(req.params.id);

    if (!existPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Posts.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, contents } = req.body;

//     // Belirtilen id ile bir post var mı kontrol et
//     const post = await Posts.findById(id);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
//     } else {
//       if (!title || !contents) {
//         return res
//           .status(400)
//           .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
//       } else {
//         const updatedPost = await Posts.update(id, { title, contents });
//         if (!updatedPost) {
//           return res
//             .status(500)
//             .json({ message: "Gönderi bilgileri güncellenemedi" });
//         } else {
//           // Güncelleme başarılı
//           return res.status(200).json(updatedPost);
//         }
//       }

//       // Güncelleme işlemi yap
//     }

//     // Request bodyde title ya da contents yoksa
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Gönderi bilgileri güncellenemedi" });
//   }
// });

// router.delete("/:id", (req, res) => {
//   const { id } = req.params;

//   postModel
//     .remove(id)
//     .then((count) => {
//       if (count > 0) {
//         res.status(200).json({ message: `${count} post(s) deleted` });
//       } else {
//         res.status(404).json({ message: "Post not found" });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Could not delete post" });
//     });
// });

// router.get("/:id/comments", (req, res) => {
//   const { id } = req.params;

//   postModel
//     .findPostComments(id)
//     .then((comments) => {
//       res.status(200).json(comments);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Could not retrieve comments" });
//     });
// });

module.exports = router;
