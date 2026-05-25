const express = require("express");
const cors = require("cors");

const jobs = require("./data/jobs.json");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/*
-----------------------------------
HEALTH CHECK
-----------------------------------
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mock Job API Running"
  });
});

/*
-----------------------------------
GET ALL JOBS
-----------------------------------
*/
app.get("/api/jobs", (req, res) => {
  res.json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

/*
-----------------------------------
GET JOB BY ID
-----------------------------------
*/
app.get("/api/jobs/:id", (req, res) => {
  const id = Number(req.params.id);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found"
    });
  }

  res.json({
    success: true,
    data: job
  });
});

/*
-----------------------------------
GET JOB BY SLUG
-----------------------------------
*/
app.get("/api/job/slug/:slug", (req, res) => {
  const slug = req.params.slug;

  const job = jobs.find(j => j.slug === slug);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found"
    });
  }

  res.json({
    success: true,
    data: job
  });
});

/*
-----------------------------------
FILTERS
-----------------------------------
*/
app.get("/api/search", (req, res) => {
  const {
    location,
    department,
    work_mode,
    employment_type,
    posting_status
  } = req.query;

  let filtered = [...jobs];

  if (location) {
    filtered = filtered.filter(
      j =>
        j.location_city
          .toLowerCase()
          .includes(location.toLowerCase())
    );
  }

  if (department) {
    filtered = filtered.filter(
      j =>
        j.department
          .toLowerCase()
          .includes(department.toLowerCase())
    );
  }

  if (work_mode) {
    filtered = filtered.filter(
      j =>
        j.work_mode.toLowerCase() ===
        work_mode.toLowerCase()
    );
  }

  if (employment_type) {
    filtered = filtered.filter(
      j =>
        j.employment_type.toLowerCase() ===
        employment_type.toLowerCase()
    );
  }

  if (posting_status) {
    filtered = filtered.filter(
      j =>
        j.posting_status.toLowerCase() ===
        posting_status.toLowerCase()
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});