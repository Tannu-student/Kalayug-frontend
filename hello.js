// backend/server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const gdaRoutes = require("./routes/gda");
const storytellerRoutes = require("./routes/storyteller");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/gda", gdaRoutes);
app.use("/storyteller", storytellerRoutes);
app.use("/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


// backend/routes/gda.js

const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Storage for uploaded motifs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "backend/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload motif
router.post("/upload", upload.single("motif"), (req, res) => {
  res.json({
    message: "Motif uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`
  });
});

// Generate mock designs
router.post("/generate", (req, res) => {
  setTimeout(() => {
    res.json({
      designs: [
        "https://picsum.photos/300/200?random=1",
        "https://picsum.photos/300/200?random=2",
        "https://picsum.photos/300/200?random=3"
      ]
    });
  }, 3000); // simulate AI delay
});

module.exports = router;


// backend/routes/storyteller.js

const express = require("express");
const Router = express.Router();

router.post("/generate", (req, res) => {
  const { text } = req.body;
  setTimeout(() => {
    res.json({
      description: `Here’s a crafted story: ${text} ... (150+ words mock).`,
      captions: [
        "Discover the heritage in every stitch.",
        "Tradition meets innovation.",
        "Your story, beautifully told."
      ],
      hashtags: ["#Handmade", "#KalaYug", "#ArtisanStories"]
    });
  }, 2000);
});

module.exports = router;


// backend/routes/profile.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "../data.json");

// Load data
const loadData = () => JSON.parse(fs.existsSync(dataPath) ? fs.readFileSync(dataPath) : "[]");
// Save data
const saveData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// Save project
router.post("/save", (req, res) => {
  const data = loadData();
  data.push(req.body);
  saveData(data);
  res.json({ message: "Project saved successfully!" });
});

// Fetch projects
router.get("/all", (req, res) => {
  res.json(loadData());
});

module.exports = router;


document.addEventListener("DOMContentLoaded", () => {
  const useBtn = document.getElementById("useBtn");
  const payBtn = document.getElementById("payBtn");
  const creditsEl = document.getElementById("credits");
  const statusEl = document.getElementById("status");

  let credits = 3;

  useBtn.addEventListener("click", async () => {
    if (credits > 0) {
      credits--;
      creditsEl.textContent = credits;
      statusEl.textContent = `You have ${credits} free credits left.`;
      if (credits === 0) {
        useBtn.style.display = "none";
        payBtn.style.display = "inline-block";
      }
    } else {
      alert("Please pay to continue.");
    }
  });

  payBtn.addEventListener("click", async () => {
    // Simulate calling backend for payment
    const res = await fetch("/pay", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      credits = 1; // After payment, give 1 credit
      creditsEl.textContent = credits;
      statusEl.textContent = `Payment successful. You got 1 more credit.`;
      useBtn.style.display = "inline-block";
      payBtn.style.display = "none";
    } else {
      alert("Payment failed. Try again.");
    }
  });
});


const express = require("express");
const App = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname)); // serve frontend files
app.use(express.json());

// Simulate payment API
app.post("/pay", (req, res) => {
  // Here you would integrate Razorpay/Stripe/Paytm
  console.log("Payment request received. Charging ₹5...");
  // Simulating success:
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


