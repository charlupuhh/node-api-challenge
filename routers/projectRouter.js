const express = require("express");
const ProjectDb = require("../data/helpers/projectModel");

const router = express.Router();

//returns an array of all projects in database
router.get("/", (req, res) => {
  try {
    ProjectDb.get().then((projects) => {
      res.status(200).json( projects );
    });
  } catch {
    res.status(500).json({ errorMessage: "Unable to get projects" });
  }
});

//returns one project object with the id passed to it if it exists
router.get("/:id", validateProjectId, (req, res) => {
  try {
    const { id } = req.params;
    ProjectDb.get(id).then((project) => {
      res.status(200).json( project );
    });
  } catch {
    res.status(500).json({ errorMessage: "Unable to get project" });
  }
});

//returns a list of actions for the project id passed in
router.get("/:id/actions", validateProjectId, (req, res) => {
  try {
    ProjectDb.getProjectActions(req.project).then((actions) => {
      if (actions[0] === undefined) {
        res
          .status(200)
          .json({ message: "That project currently has no actions" });
      } else {
        res.status(200).json({ actions });
      }
    });
  } catch {
    res.status(500).json({ errorMessage: "Unable to get project actions" });
  }
});


//adds a new project to the database
router.post("/", validateProject, (req, res) => {
  try {
    ProjectDb.insert(req.body).then((project) => {
      res.status(201).json( project );
    });
  } catch {
    res
      .status(500)
      .json({ errorMessage: "Could not add project to database." });
  }
});

//edits the provided project id with the provided new information
router.put("/:id", validateProjectId, validateProject, (req, res) => {
  try {
    ProjectDb.update(req.project, req.body).then((newProject) => {
      res.status(200).json( newProject );
    });
  } catch {
    res.status(500).json({ errorMessage: "Could not edit the project" });
  }
});

//deletes the project with the provided id from the database
router.delete("/:id", validateProjectId, (req, res) => {
  try {
    ProjectDb.remove(req.project).then((deleted) => {
      res.status(200).json({ numPostsDeleted: deleted });
    });
  } catch {
    res
      .status(500)
      .json({ errorMessage: "Unable to delete project from the database" });
  }
});

//custom middleware
function validateProjectId(req, res, next) {
  const projectId = req.params.id;

  ProjectDb.get(projectId)
    .then((project) => {
      if (project === null) {
        res.status(400).json({ message: "Invalid project id" });
      } else {
        req.project = projectId;
        next();
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid project id" });
    });
}

function validateProject(req, res, next) {
  const projectInfo = req.body;

  if (!projectInfo.name || !projectInfo.description) {
    res.status(400).json({
      message: "Please include a name and description for the project",
    });
  } else {
    next();
  }
}

module.exports = router;