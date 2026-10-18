require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

const missingVariables = [
  ["MONGODB_URI", MONGODB_URI],
  ["ADMIN_USERNAME", ADMIN_USERNAME],
  ["ADMIN_PASSWORD", ADMIN_PASSWORD],
  ["SESSION_SECRET", SESSION_SECRET]
]
  .filter(([, value]) => !value || !String(value).trim())
  .map(([name]) => name);

if (missingVariables.length) {
  throw new Error(
    `Missing required environment variables: ${missingVariables.join(", ")}. ` +
    "Add them to your local .env file or hosting provider environment settings."
  );
}

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// SESSION
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 60 * 60 * 1000
  }
}));

// FAQ SCHEMA
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 250
  },
  category: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 2000
  }
}, { timestamps: true });

const FAQ = mongoose.model("FAQ", faqSchema);

// EVENT SCHEMA
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150
  },
  category: {
    type: String,
    enum: ["Event", "Exam", "Admission", "General"],
    default: "Event"
  },
  date: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  time: {
    type: String,
    trim: true,
    maxlength: 50,
    default: ""
  },
  venue: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ""
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 3000
  },
  poster: {
    type: String,
    default: ""
  },
  createdBy: {
    type: String,
    default: "admin"
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

// INPUT CLEANING
function cleanInput(value) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim()
    : "";
}

// FAQ VALIDATION
function validateFAQData(data = {}) {
  const question = cleanInput(data.question);
  const category = cleanInput(data.category);
  const answer = cleanInput(data.answer);

  if (!question || !category || !answer) {
    return {
      valid: false,
      message: "All fields are required."
    };
  }

  if (question.length < 5 || question.length > 250) {
    return {
      valid: false,
      message: "Question must contain 5–250 characters."
    };
  }

  if (category.length < 2 || category.length > 50) {
    return {
      valid: false,
      message: "Category must contain 2–50 characters."
    };
  }

  if (answer.length < 5 || answer.length > 2000) {
    return {
      valid: false,
      message: "Answer must contain 5–2000 characters."
    };
  }

  return {
    valid: true,
    data: { question, category, answer }
  };
}

// EVENT VALIDATION
function validateEventData(data = {}) {
  const title = cleanInput(data.title);
  const category = cleanInput(data.category);
  const date = cleanInput(data.date);
  const time = cleanInput(data.time);
  const venue = cleanInput(data.venue);
  const description = cleanInput(data.description);

  if (!title || !category || !date || !description) {
    return {
      valid: false,
      message: "Title, category, date and description are required."
    };
  }

  if (!["Event", "Exam", "Admission", "General"].includes(category)) {
    return {
      valid: false,
      message: "Invalid event category."
    };
  }

  if (title.length < 3 || title.length > 150) {
    return {
      valid: false,
      message: "Event title must contain 3–150 characters."
    };
  }

  if (date.length > 50 || time.length > 50 || venue.length > 200) {
    return {
      valid: false,
      message: "Date, time or venue is too long."
    };
  }

  if (description.length < 5 || description.length > 3000) {
    return {
      valid: false,
      message: "Description must contain 5–3000 characters."
    };
  }

  return {
    valid: true,
    data: { title, category, date, time, venue, description }
  };
}

// POSTER VALIDATION
function validatePoster(poster) {
  if (!poster) {
    return { valid: true, value: "" };
  }

  if (
    typeof poster !== "string" ||
    !/^data:image\/(jpeg|png|webp);base64,/.test(poster)
  ) {
    return {
      valid: false,
      message: "Only JPG, PNG or WEBP images are allowed."
    };
  }

  if (poster.length > 7 * 1024 * 1024) {
    return {
      valid: false,
      message: "Poster image is too large. Maximum size is about 5 MB."
    };
  }

  return { valid: true, value: poster };
}

// ADMIN AUTHENTICATION
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized. Admin login required."
  });
}

// ADMIN LOGIN
app.post("/api/login", (req, res) => {
  const username = cleanInput(req.body.username);
  const password = req.body.password || "";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.username = username;

    return res.json({
      success: true,
      message: "Login successful."
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password."
  });
});

// CHECK ADMIN LOGIN
app.get("/api/check-auth", (req, res) => {
  if (req.session && req.session.isAdmin === true) {
    return res.json({
      authenticated: true,
      username: req.session.username
    });
  }

  return res.json({ authenticated: false });
});

// ADMIN LOGOUT
app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed."
      });
    }

    res.clearCookie("connect.sid");

    return res.json({
      success: true,
      message: "Logged out successfully."
    });
  });
});

// GET ALL FAQS
app.get("/api/faqs", async (req, res) => {
  try {
    const faqs = await FAQ.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json(faqs);
  } catch (error) {
    console.error("Fetch FAQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs."
    });
  }
});

// ADD FAQ
app.post("/api/faqs", requireAdmin, async (req, res) => {
  try {
    const validation = validateFAQData(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const faq = new FAQ(validation.data);
    await faq.save();

    return res.status(201).json({
      success: true,
      message: "FAQ added successfully.",
      faq
    });
  } catch (error) {
    console.error("Add FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add FAQ."
    });
  }
});

// EDIT FAQ
app.put("/api/faqs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID."
      });
    }

    const validation = validateFAQData(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const faq = await FAQ.findByIdAndUpdate(
      id,
      validation.data,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found."
      });
    }

    return res.json({
      success: true,
      message: "FAQ updated successfully.",
      faq
    });
  } catch (error) {
    console.error("Edit FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update FAQ."
    });
  }
});

// DELETE FAQ
app.delete("/api/faqs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID."
      });
    }

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found."
      });
    }

    return res.json({
      success: true,
      message: "FAQ deleted successfully."
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete FAQ."
    });
  }
});

// GET ALL EVENTS / NOTICES
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json(events);
  } catch (error) {
    console.error("Fetch Events Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch events."
    });
  }
});

// GET ONE EVENT
app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID."
      });
    }

    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    return res.json(event);
  } catch (error) {
    console.error("Get Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event."
    });
  }
});

// ADD EVENT / NOTICE
app.post("/api/events", requireAdmin, async (req, res) => {
  try {
    const validation = validateEventData(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const posterValidation = validatePoster(req.body.poster);

    if (!posterValidation.valid) {
      return res.status(400).json({
        success: false,
        message: posterValidation.message
      });
    }

    const event = new Event({
      ...validation.data,
      poster: posterValidation.value,
      createdBy: req.session.username || "admin"
    });

    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event added successfully.",
      event
    });
  } catch (error) {
    console.error("Add Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add event."
    });
  }
});

// EDIT EVENT / NOTICE
app.put("/api/events/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID."
      });
    }

    const validation = validateEventData(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const updateData = { ...validation.data };

    if (
      typeof req.body.poster === "string" &&
      req.body.poster.trim() !== ""
    ) {
      const posterValidation = validatePoster(req.body.poster);

      if (!posterValidation.valid) {
        return res.status(400).json({
          success: false,
          message: posterValidation.message
        });
      }

      updateData.poster = posterValidation.value;
    }

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    return res.json({
      success: true,
      message: "Event updated successfully.",
      event
    });
  } catch (error) {
    console.error("Edit Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update event."
    });
  }
});

// DELETE EVENT / NOTICE
app.delete("/api/events/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID."
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    return res.json({
      success: true,
      message: "Event deleted successfully."
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete event."
    });
  }
});

// CAMPUS LOCATIONS
const campusLocations = [
  {
    id: "lnct",
    name: "LNCT",
    description: "Lakshmi Narain College of Technology Main Campus",
    category: "Academic Block",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "lncts",
    name: "LNCTS",
    description: "Lakshmi Narain College of Technology & Science",
    category: "Academic Block",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "lncte",
    name: "LNCTE",
    description: "Lakshmi Narain College of Technology Excellence",
    category: "Academic Block",
    address: "LNCT Campus, Khajuri Khurd, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "mca",
    name: "MCA Block",
    description: "MCA Academic Block",
    category: "Academic Block",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "cv-raman",
    name: "C.V. Raman Block",
    description: "C.V. Raman Academic Block",
    category: "Academic Block",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "charles-babbage",
    name: "Charles Babbage Block",
    description: "Charles Babbage Academic Block",
    category: "Academic Block",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "central-library",
    name: "Central Library",
    description: "LNCT Central Library",
    category: "Facility",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "central-workshop",
    name: "Central Workshop",
    description: "LNCT Central Workshop",
    category: "Facility",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  },
  {
    id: "vishwakarma",
    name: "Vishwakarma Block",
    description: "Vishwakarma Academic Block",
    category: "Academic Block",
    address: "LNCT Campus, Kalchuri Nagar, Raisen Road, Bhopal",
    latitude: 23.251179,
    longitude: 77.524627
  }
];

// GET ALL CAMPUS LOCATIONS
app.get("/api/locations", (req, res) => {
  res.json(campusLocations);
});

// GET ONE CAMPUS LOCATION
app.get("/api/locations/:id", (req, res) => {
  const location = campusLocations.find(
    item => item.id === req.params.id
  );

  if (!location) {
    return res.status(404).json({
      success: false,
      message: "Campus location not found."
    });
  }

  return res.json(location);
});

// FRONTEND FILES
app.use(express.static(path.join(__dirname)));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

// CONNECT DATABASE, FIX OLD INDEX, THEN START SERVER
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected ✅");

    // Remove only the obsolete unique index on FAQ field "id".
    // FAQ documents are not deleted.
    try {
      const collection = mongoose.connection.collection("faqs");
      const indexes = await collection.indexes();

      const oldIndex = indexes.find(index =>
        index.name === "id_1" &&
        index.key &&
        index.key.id === 1
      );

      if (oldIndex) {
        await collection.dropIndex("id_1");
        console.log("Removed obsolete FAQ id_1 index ✅");
      }
    } catch (indexError) {
      if (
        indexError.codeName !== "NamespaceNotFound" &&
        indexError.code !== 26
      ) {
        console.error("FAQ index check:", indexError.message);
      }
    }

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("FAQ API enabled ✅");
      console.log("Admin login enabled ✅");
      console.log("Events / Notice Board API enabled ✅");
      console.log("Campus Navigation API enabled ✅");
    });
  } catch (error) {
    console.error("Server startup failed ❌", error);
    process.exit(1);
  }
}

startServer();